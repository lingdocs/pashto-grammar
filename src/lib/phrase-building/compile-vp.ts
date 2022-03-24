import {
    Types as T,
    concatPsString,
    removeAccents,
    grammarUnits,
    getVerbBlockPosFromPerson,
} from "@lingdocs/pashto-inflector";
import { removeBa } from "./vp-tools";

type ListOfEntities = (T.PsString & { isVerbPrefix?: boolean, prefixFollowedByParticle?: boolean })[][];

export function compileVP(VP: VPRendered, form: FormVersion): { ps: T.SingleOrLengthOpts<T.PsString[]>, e?: string [] } {
    const { head, rest } = VP.verb.ps;
    const { kids, NPs } = shrinkEntitiesAndGatherKids(VP, form);
    return {
        ps: compilePs(NPs, head, rest, VP.verb.negative, kids),
        e: compileEnglish(VP),
    };
}

// TODO: ISSUE off prefix-nu in the phonetics

function compilePs(
    nps: ListOfEntities,
    head: T.PsString | undefined,
    rest: T.PsString[],
    negative: boolean,
    kids: ListOfEntities,
): T.PsString[];
function compilePs(
    nps: ListOfEntities,
    head: T.PsString | undefined,
    rest: T.SingleOrLengthOpts<T.PsString[]>,
    negative: boolean,
    kids: ListOfEntities,
): T.SingleOrLengthOpts<T.PsString[]>;
function compilePs(
    nps: ListOfEntities,
    head: T.PsString | undefined,
    rest: T.SingleOrLengthOpts<T.PsString[]>,
    negative: boolean,
    kids: ListOfEntities,
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
    const verbEntities = compileVerbWNegative(head, rest, negative)
    const entities: ListOfEntities = [
        ...nps,
        ...verbEntities,
    ];
    const entitiesWKids = putKidsInKidsSection(
        entities,
        kids,
    );
    return combineEntities(entitiesWKids);
}

function shrinkEntitiesAndGatherKids(VP: VPRendered, form: FormVersion): { kids: ListOfEntities, NPs: ListOfEntities } {
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

function putKidsInKidsSection(entities: ListOfEntities, kids: ListOfEntities): ListOfEntities {
    const first = entities[0];
    const rest = entities.slice(1);
    return [
        first.map(x => (
            x.isVerbPrefix &&
            // TODO: This isn't quite working
            (kids.length)
        ) ? { ...x, prefixFollowedByParticle: true } : x),
        ...kids,
        ...rest,
    ];
}

function combineEntities(loe: ListOfEntities): T.PsString[] {
    const first = loe[0];
    const rest = loe.slice(1);
    if (!rest.length) return first;
    return combineEntities(rest).flatMap(r => (
        first.map(ps => concatPsString(
            ps,
            (ps.prefixFollowedByParticle
                ? { p: "", f: "-" }
                : ps.isVerbPrefix ? "" : " "),
            r,
        ))
    ));
}


function compileVerbWNegative(head: T.PsString | undefined, restRaw: T.PsString[], negative: boolean): ListOfEntities {
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