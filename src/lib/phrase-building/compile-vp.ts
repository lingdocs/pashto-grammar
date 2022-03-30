import {
    Types as T,
    concatPsString,
    removeAccents,
    grammarUnits,
    getVerbBlockPosFromPerson,
    makePsString,
} from "@lingdocs/pashto-inflector";
import { removeBa } from "./vp-tools";

// also
// nú dey me leeduley

// نه مې دی لیدلی - nú me dey leeduley
// لیدلی مې نه دی - leeduley me nú dey
//
// TODO: make it an option to include O S V order ?
// TODO: tu ba laaR nu she hyphens all messed up
type Form = FormVersion & { OSV?: boolean };
export function compileVP(VP: VPRendered, form: Form): { ps: T.SingleOrLengthOpts<T.PsString[]>, e?: string [] };
export function compileVP(VP: VPRendered, form: Form, combineLengths: true): { ps: T.PsString[], e?: string [] };
export function compileVP(VP: VPRendered, form: Form, combineLengths?: true): { ps: T.SingleOrLengthOpts<T.PsString[]>, e?: string [] } {
    const verb = VP.verb.ps;
    const { kids, NPs } = getSegmentsAndKids(VP, form);
    const psResult = compilePs({
        NPs,
        kids,
        verb,
        hasLeapfrog: VP.verb.tenseCategory !== "basic",
        negative: VP.verb.negative,
        isCompound: VP.isCompound,
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
    isCompound: "stative" | "dynamic" | false,
    hasLeapfrog: boolean,
    negative: boolean,
}
function compilePs({ NPs, kids, verb: { head, rest }, isCompound, hasLeapfrog, negative }: CompilePsInput): T.SingleOrLengthOpts<T.PsString[]> {
    if ("long" in rest) {
        return {
            long: compilePs({ NPs, verb: { head, rest: rest.long }, negative, hasLeapfrog, isCompound, kids }) as T.PsString[],
            short: compilePs({ NPs, verb: { head, rest: rest.short }, negative, hasLeapfrog, isCompound, kids }) as T.PsString[],
            ...rest.mini ? {
                mini: compilePs({ NPs, verb: { head, rest: rest.mini }, negative, hasLeapfrog, isCompound, kids }) as T.PsString[],
            } : {},
        };
    }
    const verbWNegativeVersions = arrangeVerbWNegative(head, rest, negative, isCompound, hasLeapfrog);

    // put together all the different possible permutations based on:
    // a. potential different versions of where the nu goes
    return verbWNegativeVersions.flatMap((verbSegments) => (
    // b. potential reordering of NPs
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

function getSegmentsAndKids(VP: VPRendered, form: Form): { kids: Segment[], NPs: Segment[][] } {
    const SO = {
        subject: VP.subject.ps,
        object: typeof VP.object === "object" ? VP.object.ps : undefined,
    }
    const removeKing = form.removeKing && !(VP.isCompound === "dynamic" && VP.isPast);
    const shrinkServant = form.shrinkServant && !(VP.isCompound === "dynamic" && !VP.isPast);

    const toShrink = (() => {
        if (!shrinkServant) return undefined;
        if (!VP.servant) return undefined;
        const servant = VP[VP.servant];
        if (typeof servant !== "object") return undefined;
        return servant;
    })();
    function getSegment(t: "subject" | "object"): Segment | undefined {
        const word = (VP.servant === t)
            ? (!shrinkServant ? SO[t] : undefined)
            : (VP.king === t)
            ? (!removeKing ? SO[t] : undefined)
            : undefined;
        if (!word) return undefined;
        return makeSegment(word);
    }
    const subject = getSegment("subject");
    const object = getSegment("object");

    return {
        kids: [
            ...VP.verb.hasBa
                ? [makeSegment(grammarUnits.baParticle, ["isBa", "isKid"])] : [],
            ...toShrink
                ? [shrinkNP(toShrink)] : [],
        ],
        NPs: [
            [
                ...subject ? [subject] : [],
                ...object ? [object] : [],
            ],
            // TODO: make this an option to also include O S V order ??
            // also show O S V if both are showing
            ...(subject && object && form.OSV) ? [[object, subject]] : [],
        ],
    };
}

function putKidsInKidsSection(segments: Segment[], kids: Segment[]): Segment[] {
    const first = segments[0];
    const rest = segments.slice(1);
    return [
        first,
        // TODO: simplify to just isKidAfterHead ??
        ...(first.isVerbHead && rest[0] && rest[0].isVerbRest)
            ? kids.map(k => k.adjust({ desc: ["isKidBetweenHeadAndRest"] }))
            : kids,
        ...rest,
    ];
}

function arrangeVerbWNegative(head: T.PsString | undefined, restRaw: T.PsString[], negative: boolean, isCompound: "stative" | "dynamic" | false, hasLeapfrog: boolean): Segment[][] {
    const rest = (() => {
        if (hasLeapfrog) {
            const [restF, restLast] = splitOffLeapfrogWord(restRaw);
            return {
                front: makeSegment(restF.map(removeBa), ["isVerbRest"]),
                last: makeSegment(restLast.map(removeBa), ["isVerbRest"]),
            };
        } 
        return makeSegment(restRaw.map(removeBa), ["isVerbRest"]);
    })();
    const headSegment: Segment | undefined = !head
        ? head
        : makeSegment(
            head,
            (head.p === "و" || head.p === "وا")
                ? ["isVerbHead", "isOoOrWaaHead"]
                : ["isVerbHead"]
        );
    if (!negative) {
        if ("front" in rest) {
            return [
                headSegment ? [headSegment, rest.front, rest.last] : [rest.front, rest.last],
            ]
        }
        return [
            headSegment ? [headSegment, rest] : [rest],
        ];
    }
    const nu: T.PsString = { p: "نه", f: "nú" };
    if (!headSegment) {
        if ("front" in rest) {
            return [
                // pefect nu dey me leeduley and nu me dey leeduley
                [
                    mergeSegments(
                        makeSegment(nu, ["isNu"]),
                        rest.last.adjust({ ps: removeAccents }),
                    ),
                    rest.front.adjust({ ps: removeAccents }),
                ],
                [
                    makeSegment(nu, ["isNu"]),
                    rest.last.adjust({ ps: removeAccents }),
                    rest.front.adjust({ ps: removeAccents }),
                ],
                [
                    rest.front.adjust({ ps: removeAccents }),
                    makeSegment(nu, ["isNu"]),
                    rest.last.adjust({ ps: removeAccents }),
                ],
            ];
        }
        return [[
            makeSegment(nu, ["isNu"]),
            rest.adjust({ ps: removeAccents }),
        ]];
    }
    if ("front" in rest) {
        return [
            [
                ...headSegment ? [headSegment.adjust({ ps: removeAccents })] : [],
                rest.last.adjust({
                    ps: r => concatPsString(nu, " ", removeAccents(r)),
                    desc: ["isNu"],
                }),
                rest.front.adjust({
                    ps: r => removeAccents(r),
                }),
            ],
            [
                ...headSegment ? [headSegment.adjust({ ps: removeAccents })] : [],
                rest.front.adjust({
                    ps: r => removeAccents(r),
                }),
                rest.last.adjust({
                    ps: r => concatPsString(nu, " ", removeAccents(r)),
                    desc: ["isNu"],
                }),
            ],
            // TODO: do something like this with the leapfrog?
            // // verbs that have a perfective prefix that is not و or وا can put the
            // // nu *before* the prefix as well // TODO: also وي prefixes?
            // ...(!headSegment.isOoOrWaaHead && !isCompound) ? [[
            //     makeSegment(nu, ["isNu"]),
            //     headSegment.adjust({ ps: removeAccents }),
            //     rest.adjust({ ps: removeAccents }),
            // ]] : [],
        ];       
    }
    return [
        [
            ...headSegment ? [headSegment.adjust({ ps: removeAccents })] : [],
            rest.adjust({
                ps: r => concatPsString(nu, " ", removeAccents(r)),
                desc: ["isNu"],
            }),
        ],
        // verbs that have a perfective prefix that is not و or وا can put the
        // nu *before* the prefix as well // TODO: also وي prefixes?
        ...(!headSegment.isOoOrWaaHead && !isCompound) ? [[
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

function mergeSegments(s1: Segment, s2: Segment): Segment {
    return s2.adjust({ ps: (p) => concatPsString(s1.ps[0], " ", p) });
}

function addSpacesBetweenSegments(segments: Segment[]): (Segment | " " | "" | T.PsString)[] {
    const o: (Segment | " " | "" | T.PsString)[] = [];
    for (let i = 0; i < segments.length; i++) {
        const current = segments[i];
        const next = segments[i+1];
        o.push(current);
        if (!next) break;
        if (
            // stative compound part
            !current.ps[0].p.endsWith(" ")
            &&
            (
                (next.isKidBetweenHeadAndRest || next.isNu)
                ||
                (next.isVerbRest && current.isKidBetweenHeadAndRest)
            )
        ) {
            o.push({
                f: " ", // TODO: make this "-" in the right places
                p: ((current.isVerbHead && (next.isMiniPronoun || next.isNu))
                || (current.isOoOrWaaHead && (next.isBa || next.isNu))) ? "" : " ", // or if its waa head
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

// SEGMENT TOOLS
// TODO: PULL OUT FOR SHARING ACROSS COMPILE EP ETC?

type SegmentDescriptions = {
    isVerbHead?: boolean,
    isOoOrWaaHead?: boolean,
    isVerbRest?: boolean,
    isMiniPronoun?: boolean,
    isKid?: boolean,
    // TODO: Simplify to just isKidAfterHead?
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

function splitOffLeapfrogWord(psVs: T.PsString[]): [T.PsString[], T.PsString[]] {
    return psVs.reduce((tp, ps) => {
        const pWords = ps.p.split(" ");
        const fWords = ps.f.split(" ");
        const beginning = makePsString(
            pWords.slice(0, -1).join(" "),
            fWords.slice(0, -1).join(" "),
        );
        const end = makePsString(
            pWords.slice(-1).join(" "),
            fWords.slice(-1).join(" "),
        );
        return [[...tp[0], beginning], [...tp[1], end]];
    }, [[], []] as [T.PsString[], T.PsString[]]);
}