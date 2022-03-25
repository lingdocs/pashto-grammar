import {
    Types as T,
    concatPsString,
    removeAccents,
    grammarUnits,
    getVerbBlockPosFromPerson,
} from "@lingdocs/pashto-inflector";
import { removeBa } from "./vp-tools";

type Segment = {
    isVerbHead?: boolean,
    isOoHead?: boolean,
    isVerbRest?: boolean,
    isMiniPronoun?: boolean,
    isNu?: boolean,
    isBa?: boolean,
    ps: T.PsString[],
};

export function compileVP(VP: VPRendered, form: FormVersion): { ps: T.SingleOrLengthOpts<T.PsString[]>, e?: string [] } {
    const { head, rest } = VP.verb.ps;
    const { kids, NPs } = shrinkSegmentsAndGatherKids(VP, form);
    return {
        ps: compilePs({
            NPs,
            kids,
            head,
            rest,
            negative: VP.verb.negative,
        }),
        e: compileEnglish(VP),
    };
}

type CompilePsInput = {
    NPs: Segment[],
    kids: Segment[],
    head: T.PsString | undefined,
    rest: T.SingleOrLengthOpts<T.PsString[]>,
    negative: boolean,
}
function compilePs({ NPs, kids, head, rest, negative }: CompilePsInput): T.SingleOrLengthOpts<T.PsString[]> {
    if ("long" in rest) {
        return {
            long: compilePs({ NPs, head, rest: rest.long, negative, kids }) as T.PsString[],
            short: compilePs({ NPs, head, rest: rest.short, negative, kids }) as T.PsString[],
            ...rest.mini ? {
                mini: compilePs({ NPs, head, rest: rest.mini, negative, kids }) as T.PsString[],
            } : {},
        };
    }
    const verbSegments = compileVerbWNegative(head, rest, negative)
    const segments: Segment[] = [
        ...NPs,
        ...verbSegments,
    ];
    const segmentsWKids = putKidsInKidsSection(
        segments,
        kids,
    );
    // have all these pieces labelled
    // add spaces
    const segmentsWithSpaces = addSpacesBetweenSegments(segmentsWKids);
    return combineSegments(segmentsWithSpaces);
}

function addSpacesBetweenSegments(segments: Segment[]): (Segment | " " | "" | "-")[] {
    const o: (Segment | " " | "" | "-")[] = [];
    for (let i = 0; i < segments.length; i++) {
        const current = segments[i];
        const next = segments[i+1];
        o.push(current);
        if (!next) break;
        if (current.isVerbHead &&
            (
                (next.isMiniPronoun || next.isNu)
                ||
                (current.isOoHead && next.isBa)
            )
        ) {
            o.push("-");
        } else if (current.isVerbHead && next.isVerbRest) {
            o.push("");
        } else {
            o.push(" ");
        }
    }
    return o;
}

function shrinkSegmentsAndGatherKids(VP: VPRendered, form: FormVersion): { kids: Segment[], NPs: Segment[] } {
    const main = {
        subject: VP.subject.ps,
        object: typeof VP.object === "object" ? VP.object.ps : undefined,
    }
    const { removeKing, shrinkServant } = form;
    const shrinkCanditate = (shrinkServant && VP.servant)
        ? VP[VP.servant]
        : undefined;
    const toShrink = (!shrinkCanditate || typeof shrinkCanditate !== "object")
        ? undefined
        : shrinkCanditate;
    // TODO: big problem, the king removal doesn't work with grammatically transitive things
    const king = main[VP.king];
    const showSubject = (VP.king === "subject" && !removeKing && king) || (VP.servant === "subject" && !shrinkServant);
    const showObject = (
        (VP.king === "object" && !removeKing && king) || (VP.servant === "object" && !shrinkServant)
    );
    return {
        kids: [
            ...VP.verb.hasBa
                ? [{ isBa: true, ps: [grammarUnits.baParticle] }] : [],
            ...toShrink
                ? [{ isMiniPronoun: true, ps: shrink(toShrink) }] : [],
        ],
        NPs: [
            ...showSubject ? [{ ps: main.subject }] : [],
            ...(showObject && main.object) ? [{ ps: main.object }] : [],
        ],
    }
}

function shrink(np: Rendered<NPSelection>): T.PsString[] {
    const [row, col] = getVerbBlockPosFromPerson(np.person);
    return grammarUnits.pronouns.mini[row][col];
}

function putKidsInKidsSection(segments: Segment[], kids: Segment[]): Segment[] {
    const first = segments[0];
    const rest = segments.slice(1);
    return [
        first,
        ...kids,
        ...rest,
    ];
}

function compileVerbWNegative(headRaw: T.PsString | undefined, restRaw: T.PsString[], negative: boolean): Segment[] {
    const rest: Segment = {
        isVerbRest: true,
        ps: restRaw.map(removeBa),
    };
    const head: Segment | undefined = !headRaw
        ? headRaw
        : {
            ps: [headRaw],
            isVerbHead: true,
            isOoHead: headRaw.p === "و"
        };
    if (!negative) {
        return [
            ...head ? [head] : [],
            rest,
        ];
    }
    const nu: T.PsString = { p: "نه", f: "nú" };
    if (!head) {
        return [
            { ps: [nu], isNu: true },
            {
                ...rest,
                ps: rest.ps.map(p => removeAccents(p)),
            },
        ];
    }
    return [
        ...head ? [{ ...head, ps: head.ps.map(h =>removeAccents(h)) }] : [],
        {
            ...rest,
            isNu: true,
            ps: rest.ps.map(r => concatPsString(nu, " ", removeAccents(r))),
        },
    ];
}

function combineSegments(loe: (Segment | " " | "" | "-")[]): T.PsString[] {
    const first = loe[0];
    const rest = loe.slice(1);
    if (!rest.length) {
        if (typeof first === "string") {
            throw new Error("can't end with a spacer");
        }
        return first.ps;
    }
    function spaceOrDash(s: "" | " " | "-"): "" | " " | T.PsString {
        return s === "-" ? { p: "", f: "-" } : s;
    }
    return combineSegments(rest).flatMap((r) => (
        typeof first === "string"
            ? [concatPsString(spaceOrDash(first), r)]
            : first.ps.map(f => concatPsString(f, r)
        )
    ));
}

function compileEnglish(VP: VPRendered): string[] | undefined {
    function insertEWords(e: string, { subject, object }: { subject: string, object?: string }): string {
        return e.replace("$SUBJ", subject).replace("$OBJ", object || "");
    }
    const engSubj = VP.subject.e || undefined;
    const engObj = (typeof VP.object === "object" && VP.object.e) ? VP.object.e : undefined;
    // require all English parts for making the English phrase
    return (VP.englishBase && engSubj && (engObj || typeof VP.object !== "object"))
        ? VP.englishBase.map(e => insertEWords(e, {
            subject: engSubj,
            object: engObj,
        }))
        : undefined;
}