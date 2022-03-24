import {
    Types as T,
    concatPsString,
    removeAccents,
    grammarUnits,
    getVerbBlockPosFromPerson,
} from "@lingdocs/pashto-inflector";
import { isMiniPronoun, removeBa } from "./vp-tools";

type ListOfSegments = (T.PsString & { isVerbPrefix?: boolean, prefixFollowedByMiniPronoun?: boolean })[][];

export function compileVP(VP: VPRendered, form: FormVersion): { ps: T.SingleOrLengthOpts<T.PsString[]>, e?: string [] } {
    const { head, rest } = VP.verb.ps;
    const { kids, NPs } = shrinkSegmentsAndGatherKids(VP, form);
    return {
        ps: compilePs(NPs, head, rest, VP.verb.negative, kids),
        e: compileEnglish(VP),
    };
}

// TODO: ISSUE off prefix-nu in the phonetics

function compilePs(
    nps: ListOfSegments,
    head: T.PsString | undefined,
    rest: T.PsString[],
    negative: boolean,
    kids: ListOfSegments,
): T.PsString[];
function compilePs(
    nps: ListOfSegments,
    head: T.PsString | undefined,
    rest: T.SingleOrLengthOpts<T.PsString[]>,
    negative: boolean,
    kids: ListOfSegments,
): T.SingleOrLengthOpts<T.PsString[]>;
function compilePs(
    nps: ListOfSegments,
    head: T.PsString | undefined,
    rest: T.SingleOrLengthOpts<T.PsString[]>,
    negative: boolean,
    kids: ListOfSegments,
): T.SingleOrLengthOpts<T.PsString[]> {
    if ("long" in rest) {
        return {
            long: compilePs(nps, head, rest.long, negative, kids),
            short: compilePs(nps, head, rest.short, negative, kids),
            ...rest.mini ? {
                mini: compilePs(nps, head, rest.mini, negative, kids),
            } : {},
        };
    }
    const verbSegments = compileVerbWNegative(head, rest, negative)
    const segments: ListOfSegments = [
        ...nps,
        ...verbSegments,
    ];
    const segmentsWKids = putKidsInKidsSection(
        segments,
        kids,
    );
    return combineSegments(segmentsWKids);
}

function shrinkSegmentsAndGatherKids(VP: VPRendered, form: FormVersion): { kids: ListOfSegments, NPs: ListOfSegments } {
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
                ? [[grammarUnits.baParticle]] : [],
            ...toShrink
                ? [shrink(toShrink)] : [],
        ],
        NPs: [
            ...showSubject ? [main.subject] : [],
            ...(showObject && main.object) ? [main.object] : [],
        ],
    }
}

function shrink(np: Rendered<NPSelection>): T.PsString[] {
    const [row, col] = getVerbBlockPosFromPerson(np.person);
    return grammarUnits.pronouns.mini[row][col];
}

function putKidsInKidsSection(segments: ListOfSegments, kids: ListOfSegments): ListOfSegments {
    const first = segments[0];
    const rest = segments.slice(1);
    console.log({ kids }, kids.length);
    return [
        first.map(x => (
            (x.isVerbPrefix && isMiniPronoun(kids[0][0]))
                ? { ...x, prefixFollowedByMiniPronoun: true }
                : x
        )),
        ...kids,
        ...rest,
    ];
}

function combineSegments(loe: ListOfSegments): T.PsString[] {
    function isLast(index: number, arr: any[]): boolean {
        return index === (arr.length - 1);
    }
    const first = loe[0];
    const rest = loe.slice(1);
    if (!rest.length) return first;
    console.log({ loe });
    return combineSegments(rest).flatMap((r, restIndex, arr) => (
        first.map(ps => concatPsString(
            ps,
            (ps.isVerbPrefix && isLast(restIndex, arr)
                ? ""
                : ps.prefixFollowedByMiniPronoun
                ? { p: "", f: "-" }
                : ps.isVerbPrefix ? " " : " "),
            r,
        ))
    ));
}


function compileVerbWNegative(head: T.PsString | undefined, restRaw: T.PsString[], negative: boolean): ListOfSegments {
    const rest = restRaw.map(removeBa);
    if (!negative) {
        return [
            ...head ? [[{...head, isVerbPrefix: true}]] : [],
            rest,
        ];
    }
    const nu: T.PsString = { p: "نه", f: "nú" };
    if (!head) {
        return [
            [nu],
            rest.map(r => removeAccents(r)),
        ];
    }
    // const regularPrefix = head.p === "و" || head.p === "وا";
    // if (regularPrefix) {
    // dashes for oo-nu etc
    return [
        [{ ...removeAccents(head), isVerbPrefix: true }],
        rest.map(r => concatPsString(nu, " ", removeAccents(r))),
    ];
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