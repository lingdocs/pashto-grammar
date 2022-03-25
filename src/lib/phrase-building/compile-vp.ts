import {
    Types as T,
    concatPsString,
    removeAccents,
    grammarUnits,
    getVerbBlockPosFromPerson,
} from "@lingdocs/pashto-inflector";
import { removeBa } from "./vp-tools";

// TODO: make it an option to include O S V order ?? or is that just always in past tense
// TODO: tu ba laaR nu she hyphens all messed up
export function compileVP(VP: VPRendered, form: FormVersion): { ps: T.SingleOrLengthOpts<T.PsString[]>, e?: string [] };
export function compileVP(VP: VPRendered, form: FormVersion, combineLengths: true): { ps: T.PsString[], e?: string [] };
export function compileVP(VP: VPRendered, form: FormVersion, combineLengths?: true): { ps: T.SingleOrLengthOpts<T.PsString[]>, e?: string [] } {
    const verb = VP.verb.ps;
    const { kids, NPs } = getSegmentsAndKids(VP, form);
    const psResult = compilePs({
        NPs,
        kids,
        verb,
        negative: VP.verb.negative,
    });
    return {
        ps: combineLengths ? flattenLengths(psResult) : psResult,
        e: compileEnglish(VP),
    };
}

type CompilePsInput = {
    NPs: Segment[][],
    kids: Segment[],
    verb: {
        head: T.PsString | undefined,
        rest: T.SingleOrLengthOpts<T.PsString[]>,
    },
    negative: boolean,
}
function compilePs({ NPs, kids, verb: { head, rest }, negative }: CompilePsInput): T.SingleOrLengthOpts<T.PsString[]> {
    if ("long" in rest) {
        return {
            long: compilePs({ NPs, verb: { head, rest: rest.long }, negative, kids }) as T.PsString[],
            short: compilePs({ NPs, verb: { head, rest: rest.short }, negative, kids }) as T.PsString[],
            ...rest.mini ? {
                mini: compilePs({ NPs, verb: { head, rest: rest.mini }, negative, kids }) as T.PsString[],
            } : {},
        };
    }
    const verbWNegativeVersions = compileVerbWNegative(head, rest, negative);

    // put together all the different possible permutations based on:
    // potential different versions of where the nu goes
    return verbWNegativeVersions.flatMap((verbSegments) => (
    // potential reordering of NPs
        NPs.flatMap(NP => {
            // for each permutation of the possible ordering of NPs and Verb + nu
            // 1. put in kids in the kids section
            const segments = putKidsInKidsSection([...NP, ...verbSegments], kids);
            // 2. space out the words properly
            const withProperSpaces = addSpacesBetweenSegments(segments);
            // 3. throw it all together into a PsString for each permutation
            return combineSegments(withProperSpaces);
        })
    ));
}

function getSegmentsAndKids(VP: VPRendered, form: FormVersion): { kids: Segment[], NPs: Segment[][] } {
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
    const king = main[VP.king];
    const showSubject = (VP.king === "subject" && !removeKing && king) || (VP.servant === "subject" && !shrinkServant);
    const showObject = (
        (VP.king === "object" && !removeKing && king) || (VP.servant === "object" && !shrinkServant)
    );
    return {
        kids: [
            ...VP.verb.hasBa
                ? [makeSegment(grammarUnits.baParticle, ["isBa", "isKid"])] : [],
            ...toShrink
                ? [shrinkNP(toShrink)] : [],
        ],
        NPs: [
            [
                ...showSubject ? [makeSegment(main.subject)] : [],
                ...(showObject && main.object) ? [makeSegment(main.object)] : [],
            ],
            // TODO: make this an option to also include O S V order
            // also show O S V if both are showing
            // TODO: is in only in the past that you can do O S V?
            ...(VP.isPast && main.object && showObject && showSubject) ? [[
                makeSegment(main.object),
                makeSegment(main.subject),
            ]] : [],
        ],
    }
}

function putKidsInKidsSection(segments: Segment[], kids: Segment[]): Segment[] {
    const first = segments[0];
    const rest = segments.slice(1);
    return [
        first,
        ...(first.isVerbHead && rest[0] && rest[0].isVerbRest)
            ? kids.map(k => k.adjust({ desc: ["isKidBetweenHeadAndRest"] }))
            : kids,
        ...rest,
    ];
}

function compileVerbWNegative(head: T.PsString | undefined, restRaw: T.PsString[], negative: boolean): Segment[][] {
    const rest = makeSegment(restRaw.map(removeBa), ["isVerbRest"]);
    const headSegment: Segment | undefined = !head
        ? head
        : makeSegment(
            head,
            (head.p === "و" || head.p === "وا")
                ? ["isVerbHead", "isOoOrWaaHead"]
                : ["isVerbHead"]
        );
    if (!negative) {
        return [
            headSegment ? [headSegment, rest] : [rest],
        ];
    }
    const nu: T.PsString = { p: "نه", f: "nú" };
    if (!headSegment) {
        return [[
            makeSegment(nu, ["isNu"]),
            rest.adjust({ ps: removeAccents }),
        ]];
    }
    return [
        [
            ...headSegment ? [headSegment.adjust({ ps: removeAccents })] : [],
            rest.adjust({
                ps: r => concatPsString(nu, " ", removeAccents(r)),
                desc: ["isNu"],
            }),
        ],
        ...!headSegment.isOoOrWaaHead ? [[
            makeSegment(nu, ["isNu"]),
            headSegment.adjust({ ps: removeAccents }),
            rest.adjust({ ps: removeAccents }),
        ]] : [],
    ];
}

function shrinkNP(np: Rendered<NPSelection>): Segment {
    const [row, col] = getVerbBlockPosFromPerson(np.person);
    return makeSegment(grammarUnits.pronouns.mini[row][col], ["isKid", "isMiniPronoun"]);
}

function addSpacesBetweenSegments(segments: Segment[]): (Segment | " " | "" | T.PsString)[] {
    const o: (Segment | " " | "" | T.PsString)[] = [];
    for (let i = 0; i < segments.length; i++) {
        const current = segments[i];
        const next = segments[i+1];
        o.push(current);
        if (!next) break;
        if ((next.isKidBetweenHeadAndRest || next.isNu) || (next.isVerbRest && current.isKidBetweenHeadAndRest)) {
            o.push({
                f: "-",
                p: ((current.isVerbHead && (next.isMiniPronoun || next.isNu))
                || (current.isOoOrWaaHead && next.isBa )) ? "" : " ", // or if its waa head
            });
        } else if (current.isVerbHead && next.isVerbRest) {
            o.push("");
        } else {
            o.push(" ");
        }
    }
    return o;
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

type SegmentDescriptions = {
    isVerbHead?: boolean,
    isOoOrWaaHead?: boolean,
    isVerbRest?: boolean,
    isMiniPronoun?: boolean,
    isKid?: boolean,
    isKidBetweenHeadAndRest?: boolean,
    isNu?: boolean,
    isBa?: boolean,
}

type SDT = keyof SegmentDescriptions; 
type Segment = { ps: T.PsString[] } & SegmentDescriptions & {
    adjust: (o: { ps?: T.PsString | T.PsString[] | ((ps: T.PsString) => T.PsString), desc?: SDT[] }) => Segment,
};

function makeSegment(
    ps: T.PsString | T.PsString[],
    options?: (keyof SegmentDescriptions)[],     
): Segment {
    return {
        ps: Array.isArray(ps) ? ps : [ps],
        ...options && options.reduce((all, curr) => ({
            ...all,
            [curr]: true,
        }), {}),
        adjust: function(o): Segment {
            return {
                ...this,
                ...o.ps ? {
                    ps: Array.isArray(o.ps)
                        ? o.ps
                        : "p" in o.ps
                        ? [o.ps]
                        : this.ps.map(o.ps)
                    } : {},
                ...o.desc && o.desc.reduce((all, curr) => ({
                    ...all,
                    [curr]: true,
                }), {}),
            };
        },
    };
}

function combineSegments(loe: (Segment | " " | "" | T.PsString)[]): T.PsString[] {
    const first = loe[0];
    const rest = loe.slice(1);
    if (!rest.length) {
        if (typeof first === "string" || !("ps" in first)) {
            throw new Error("can't end with a spacer");
        }
        return first.ps;
    }
    return combineSegments(rest).flatMap(r => (
        (typeof first === "object" && "ps" in first)
            ? first.ps.map(f => concatPsString(f, r))
            : [concatPsString(first, r)]
        )
    );
}

function flattenLengths(r: T.SingleOrLengthOpts<T.PsString[]>): T.PsString[] {
    if ("long" in r) {
        return Object.values(r).flat();
    }
    return r;
}