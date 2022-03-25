import {
    Types as T,
    concatPsString,
    removeAccents,
    grammarUnits,
    getVerbBlockPosFromPerson,
} from "@lingdocs/pashto-inflector";
import { removeBa } from "./vp-tools";

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
    adjust: (o: { ps?: T.PsString | T.PsString[], desc?: SDT[] }) => Segment,
};

// TODO: make it an option to include O S V order

export function compileVP(VP: VPRendered, form: FormVersion): { ps: T.SingleOrLengthOpts<T.PsString[]>, e?: string [] } {
    const verb = VP.verb.ps;
    const { kids, NPs } = getSegmentsAndKids(VP, form);
    return {
        ps: compilePs({
            NPs,
            kids,
            verb,
            negative: VP.verb.negative,
        }),
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
    return verbWNegativeVersions.flatMap((verbSegments) => (
        NPs.flatMap(NP => {
            const segments = putKidsInKidsSection([...NP, ...verbSegments], kids);
            const withProperSpaces = addSpacesBetweenSegments(segments);
            return combineSegments(withProperSpaces);
        })
    ));
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
                ? [makeSegment(grammarUnits.baParticle, ["isBa"])] : [],
            ...toShrink
                ? [shrink(toShrink)] : [],
        ].map(k => ({...k, isKid: true })),
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

function shrink(np: Rendered<NPSelection>): Segment {
    const [row, col] = getVerbBlockPosFromPerson(np.person);
    return makeSegment(grammarUnits.pronouns.mini[row][col], ["isMiniPronoun"]);
}

function putKidsInKidsSection(segments: Segment[], kids: Segment[]): Segment[] {
    const first = segments[0];
    const rest = segments.slice(1);
    return [
        first,
        ...(first.isVerbHead && rest[0] && rest[0].isVerbRest)
            ? kids.map(k => ({ ...k, isKidBetweenHeadAndRest: true }))
            : kids,
        ...rest,
    ];
}

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
        adjust: function(o: { ps?: T.PsString | T.PsString[], desc?: SDT[] }): Segment {
            return {
                ...this,
                ...o.ps ? { ps: Array.isArray(o.ps) ? o.ps : [o.ps] } : {},
                ...o.desc && o.desc.reduce((all, curr) => ({
                    ...all,
                    [curr]: true,
                }), {}),
            };
        },
    }
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
            [
                ...headSegment ? [headSegment] : [],
                rest,
            ],
        ];
    }
    const nu: T.PsString = { p: "نه", f: "nú" };
    if (!headSegment) {
        return [[
            makeSegment(nu, ["isNu"]),
            rest.adjust({ ps: rest.ps.map(p => removeAccents(p)) }),
        ]];
    }
    return [
        [
            ...headSegment ? [headSegment.adjust({ ps: headSegment.ps.map(h =>removeAccents(h)) })] : [],
            rest.adjust({
                ps: rest.ps.map(r => concatPsString(nu, " ", removeAccents(r))),
                desc: ["isNu"],
            }),
        ],
        ...!headSegment.isOoOrWaaHead ? [[
            makeSegment(nu, ["isNu"]),
            headSegment.adjust({ ps: headSegment.ps.map(h =>removeAccents(h)) }),
            rest.adjust({ ps: rest.ps.map(p => removeAccents(p)) }),
        ]] : [],
    ];
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