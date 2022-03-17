import {
    Types as T,
    concatPsString,
    removeAccents,
    grammarUnits,
    getVerbBlockPosFromPerson,
} from "@lingdocs/pashto-inflector";

type ListOfEntities = T.PsString[][];

export function compileVP(VP: VPRendered): { ps: T.SingleOrLengthOpts<T.PsString[]>, e?: string [] } {
    const { head, rest } = VP.verb.ps;
    const { kids, NPs } = shrinkEntitiesAndGatherKids(VP);
    return {
        ps: compilePs(NPs, head, rest, VP.verb.negative, kids),
        e: compileEnglish(VP),
    };
}

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
    const entities: ListOfEntities = [
        ...nps,
        ...compileVerbWNegative(head, rest, negative)
    ];
    const entitiesWKids = putKidsInKidsSection(entities, kids);
    return combineEntities(entitiesWKids);
}

function shrinkEntitiesAndGatherKids(VP: VPRendered): { kids: ListOfEntities, NPs: ListOfEntities } {
    const main = {
        subject: VP.subject.ps,
        object: typeof VP.object === "object" ? VP.object.ps : undefined,
    }
    const toShrink = (VP.shrinkServant && VP.servant)
        ? VP[VP.servant]
        : undefined;
    if (!toShrink || typeof toShrink !== "object") {
        return {
            kids: [],
            NPs: [main.subject, ...main.object ? [main.object] : []]
        };
    }
    const king = main[VP.king];
    if (!king) {
        throw new Error("lost the king in the shrinking process");
    }
    return {
        kids: [shrink(toShrink)],
        NPs: [],
    }
}

function shrink(np: Rendered<NPSelection>): T.PsString[] {
    const person: T.Person = np.type === "participle"
        ? T.Person.ThirdPlurMale
        // @ts-ignore
        : np.person;
    const [row, col] = getVerbBlockPosFromPerson(person);
    return grammarUnits.pronouns.mini[row][col];
}

function putKidsInKidsSection(entities: ListOfEntities, kids: ListOfEntities): ListOfEntities {
    const first = entities[0];
    const rest = entities.slice(1);
    return [
        first,
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
            ps.p === "و" ? { p: "", f: "-" } : " ",
            r,
        ))
    ));
}


function compileVerbWNegative(head: T.PsString | undefined, rest: T.PsString[], negative: boolean): ListOfEntities {
    if (!negative) {
        return [
            ...head ? [[head]] : [],
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
        [removeAccents(head)],
        rest.map(r => concatPsString(nu, " ", removeAccents(r)))
    ];
}

function compileEnglish(VP: VPRendered): string[] | undefined {
    function insertEWords(e: string, { subject, object }: { subject: string, object?: string }): string {
        return e.replace("$SUBJ", subject).replace("$OBJ", object || "");
    }
    const engSubj = VP.subject.e || undefined;
    const engObj = (typeof VP.object === "object" && VP.object.e) ? VP.object.e : undefined;
    // require all English parts for making the English phrase
    return (VP.englishBase && engSubj && engObj) ? VP.englishBase.map(e => insertEWords(e, {
        subject: engSubj,
        object: engObj,
    })) : undefined;
}