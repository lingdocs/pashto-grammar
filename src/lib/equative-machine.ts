import {
    getPersonFromVerbForm,
    Types as T,
    getEnglishWord,
    grammarUnits,
    inflectWord,
    personIsPlural,
    removeFVarients,
    isUnisexSet,
    personGender,
    getVerbBlockPosFromPerson,
    addEnglish,
    parseEc,
    concatPsString,
} from "@lingdocs/pashto-inflector";
import {
    isArrayOneOrMore,
} from "./type-predicates";

export type EquativeMachineOutput = {
    subject: T.PsString[],
    predicate: T.PsString[],
    equative: T.SingleOrLengthOpts<T.ArrayOneOrMore<T.PsString>>,
};

export type NounInput = {
    entry: T.DictionaryEntry,
    plural: boolean,
};

export type ParticipleInput = T.DictionaryEntry & { __brand: "a participle" };
export type SpecifiedUnisexNounInput = NounInput & { gender: T.Gender };
export type PersonInput = T.Person;

export type EntityInput = SubjectInput | PredicateInput;
export type SubjectInput = PersonInput | NounInput | ParticipleInput | SpecifiedUnisexNounInput;
export type PredicateInput = PersonInput | NounInput | Adjective | SpecifiedUnisexNounInput | UnisexNoun | ParticipleInput;

export function equativeMachine(sub: SubjectInput, pred: PredicateInput): EquativeMachineOutput {
    // - english equative always agrees with subject
    // - pashto equative agrees with predicate, unless it's an adjective, in which case the
    // agreement reverts to the subject
    const subjPerson = getInputPerson(sub, "subject");
    const predPerson = getInputPerson(pred, "predicate") || subjPerson;
    const subject = makeEntity(sub);
    const predicate = makeEntity(pred, subjPerson);
    const equative = makeEquative(subjPerson, predPerson, isParticipleInput(sub));
    return {
        subject,
        predicate,
        equative,
    };
}

export function assembleEquativeOutput(o: EquativeMachineOutput): T.SingleOrLengthOpts<T.PsString[]> {
    if ("long" in o.equative) {
        return {
            long: assembleEquativeOutput({ ...o, equative: o.equative.long }) as T.PsString[],
            short: assembleEquativeOutput({ ...o, equative: o.equative.short }) as T.PsString[],
        }
    }
    // get all possible combinations of subject, predicate, and equative
    // soooo cool how this works 🤓
    const equatives = o.equative;
    const predicates = o.predicate;
    const ps = o.subject.flatMap(subj => (
        predicates.flatMap(pred => (
            equatives.map(eq => (
                concatPsString(subj, " ", pred, " ", eq))
            )
        ))
    ));
    const e = `${o.subject[0].e} ${o.equative[0].e} ${o.predicate[0].e}`;
    return ps.map(x => ({ ...x, e }));
}

// LEVEL 2 FUNCTIONS

function getInputPerson(e: SubjectInput, part: "subject"): T.Person;
function getInputPerson(e: PredicateInput, part: "predicate"): T.Person | undefined;
function getInputPerson(e: EntityInput, part: "subject" | "predicate"): T.Person | undefined {
    function nounPerson(gender: T.Gender, plural: boolean): T.Person {
        return plural
            ? ((gender === "masc") ? T.Person.ThirdPlurMale : T.Person.ThirdPlurFemale)
            : ((gender === "masc") ? T.Person.ThirdSingMale : T.Person.ThirdSingFemale);
    }
    
    if (isPersonInput(e)) return e;
    if (isNounInput(e)) {
        const gender = e.entry.c?.includes("n. m.") ? "masc" : "fem"
        return nounPerson(gender, e.plural);
    }
    if (isSpecifiedUnisexNounInput(e)) {
        return nounPerson(e.gender, e.plural);
    }
    if (isParticipleInput(e)) return T.Person.ThirdPlurMale;
    if (isUnisexNounInput(e)) return undefined;
    if (isAdjectiveInput(e)) return undefined;
}

function makeEntity(e: EntityInput, subjPerson?: T.Person): T.PsString[] {
    const isSubject = subjPerson === undefined;
    if (typeof e === "number") return makePronoun(e);
    if ("entry" in e) {
        return makeNoun(e, isSubject ? "subject" : "predicate");
    }
    if (isAdjectiveInput(e) && subjPerson !== undefined) {
        return makeAdjective(e, subjPerson);
    }
    if (isUnisexNounInput(e)) {
        if (subjPerson === undefined) throw new Error("unspecified unisex noun must be in the predicate");
        return makeUnisexNoun(e, subjPerson);
    }
    if (isParticipleInput(e)) {
        return makeParticiple(e);
    }
    throw new Error(`invalid entity in ${subjPerson ? "predicate" : "subject"}`);
}

function makeEquative(subj: T.Person, pred: T.Person, subjIsParticipleInput: boolean): T.SentenceForm {
    // The subject's person information, for the English equative
    const [sRow, sCol] = getVerbBlockPosFromPerson(subjIsParticipleInput ? T.Person.ThirdSingMale : subj);
    return addEnglish(
        // english agrees with subject
        grammarUnits.englishEquative.present[sRow][sCol],
        // pashto agrees with predicate (if possible)
        getPersonFromVerbForm(grammarUnits.equativeEndings.present, pred),
    );
}

// LEVEL 3 FUNCTIONS

function makePronoun(sub: T.Person): T.PsString[] {
    const [row, col] = getVerbBlockPosFromPerson(sub);
    return addEnglish(
        grammarUnits.persons[sub].label.subject,
        grammarUnits.pronouns.far.plain[row][col],
    );
}

function makeUnisexNoun(e: UnisexNoun, subjPerson: T.Person): T.PsString[] {
    // reuse english from make noun - do the a / an sensitivity
    // if it's the predicate - get the inflection according to the subjPerson
    const inf = inflectWord(e);
    const english = getEnglishFromNoun(e, personIsPlural(subjPerson), "predicate");
    const gender = personGender(subjPerson);
    if (!inf) {
        return [psStringFromEntry(e, english)];
    }
    // if (!inf.inflections && (!("plural" in inf) || (!inf.inflections || !isUnisexSet(inf.inflections)))) {
    //     throw Error("improper unisex noun");
    // }
    // if plural // anim // chose that
    // otherwise just chose inflection (or add both)                              
    const pashto = ((): T.ArrayOneOrMore<T.PsString> => {
        const plural = personIsPlural(subjPerson);             
        function getPlural() {
            const plural = getInf(inf, "plural", gender, true);
            const arabicPlural = getInf(inf, "arabicPlural", gender, true);
            const inflections = getInf(inf, "inflections", gender, true)
            return [
                ...plural,
                ...arabicPlural,
                // avoid useless non-inflecting masculine inflection "plural"
                ...(plural.length && inflections[0].p === e.p) ? [] : inflections,
            ];
        }
        const ps = plural
            ? getPlural()
            : getInf(inf, "inflections", gender, plural);
        return isArrayOneOrMore(ps)
            ? ps
            : [psStringFromEntry(e, english)];
    })();
    return addEnglish(english, pashto);
}

function getInf(infs: T.InflectorOutput, t: "plural" | "arabicPlural" | "inflections", gender: T.Gender, plural: boolean): T.PsString[] {
    // @ts-ignore
    if (infs && t in infs && infs[t] !== undefined && gender in infs[t] && infs[t][gender] !== undefined) {
        // @ts-ignore
        const iset = infs[t][gender] as T.InflectionSet;
        const ipick = iset[(t === "inflections" && plural) ? 1 : 0];
        return ipick;
    }
    return [];
}

function makeNoun(n: NounInput | SpecifiedUnisexNounInput, entity: "subject" | "predicate"): T.PsString[] {
    const english = getEnglishFromNoun(n.entry, n.plural, entity);

    const pashto = ((): T.ArrayOneOrMore<T.PsString> => {
        const infs = inflectWord(n.entry);
        const gender = "gender" in n
            ? n.gender
            : n.entry.c?.includes("n. f.") ? "fem" : "masc";
        const ps = !n.plural
            ? getInf(infs, "inflections", gender, false)
            : [
                ...getInf(infs, "plural", gender, true),
                ...getInf(infs, "arabicPlural", gender, true),
                ...getInf(infs, "inflections", gender, true),
            ];
        return isArrayOneOrMore(ps)
            ? ps
            : [psStringFromEntry(n.entry, english)];
    })();
    return addEnglish(english, pashto);
}

function makeAdjective(e: Adjective, pers: T.Person): T.PsString[] {
    const inf = inflectWord(e);
    const english = getEnglishWord(e);
    if (!english) throw new Error("no english available for adjective");
    if (typeof english !== "string") throw new Error("error getting english for adjective, looks like a noun");
    // non-inflecting adjective
    if (!inf) return [psStringFromEntry(e, english)];
    if (!inf.inflections) throw new Error("error getting inflections, looks like a noun")
    if (!isUnisexSet(inf.inflections)) throw new Error("inflections for adjective were not unisex, looks like a noun");
    // inflecting adjective - inflected based on the subject person
    return addEnglish(
        english,
        chooseInflection(inf.inflections, pers),
    );
}

function makeParticiple(e: T.DictionaryEntry): T.PsString[] {
    return [psStringFromEntry(e, getEnglishParticiple(e))];
}


// LEVEL 4 FUNCTIONS

function chooseInflection(inflections: T.UnisexSet<T.InflectionSet>, pers: T.Person): T.ArrayOneOrMore<T.PsString> {
    return inflections[personGender(pers)][personIsPlural(pers) ? 1 : 0];
}

function getEnglishFromNoun(entry: T.DictionaryEntry, plural: boolean, entity: "subject" | "predicate"): string {
    const articles = {
        singular: "(A/The)",
        plural: "(The)",
    };
    const article = articles[plural ? "plural" : "singular"];
    function addArticle(s: string) {
        return `${entity === "subject" ? article : article.toLowerCase()} ${s}`;
    }
    const e = getEnglishWord(entry);
    if (!e) throw new Error(`unable to get english from subject ${entry.f} - ${entry.ts}`);

    if (typeof e === "string") return ` ${e}`;
    if (plural) return addArticle(e.plural);
    if (!e.singular || e.singular === undefined) {
        throw new Error(`unable to get english from subject ${entry.f} - ${entry.ts}`);
    }
    return addArticle(e.singular);
}

// function getEnglishForUnisexNoun(pred: UnisexNounInput, pers: T.Person): string | undefined {
//     const english = getEnglishWord(pred);
//     const plurSing = personIsPlural(pers) ? "plural" : "singular";
//     return typeof english === "string"
//         ? english
//         : english === undefined
//         ? undefined
//         : english[plurSing]
//         ? english[plurSing]
//         : undefined;
// }

function psStringFromEntry(entry: T.DictionaryEntry, e: string): T.PsString {
    return {
        p: entry.p,
        f: removeFVarients(entry.f),
        e,
    };
}

function getEnglishParticiple(entry: T.DictionaryEntry): string {
    if (!entry.ec) throw new Error("no english information for participle");
    const ec = parseEc(entry.ec);
    const participle = ec[2];
    return (entry.ep)
        ? `${participle} ${entry.ep}`
        : participle;
}

export function isPersonInput(e: EntityInput): e is PersonInput {
    return typeof e === "number";
}

export function isNounInput(e: EntityInput): e is NounInput {
    if (isPersonInput(e)) return false;
    if ("entry" in e && !("gender" in e)) {
        // e
        return true;
    }
    return false;
}

export function isParticipleInput(e: EntityInput): e is ParticipleInput {
    if (isPersonInput(e)) return false;
    if ("entry" in e) return false;
    return !!e.c?.startsWith("v.");
}

export function isSpecifiedUnisexNounInput(e: EntityInput): e is SpecifiedUnisexNounInput {
    if (isPersonInput(e)) return false;
    if ("entry" in e && "gender" in e) {
        // e
        return true;
    }
    return false;
}

export function isUnisexNounInput(e: EntityInput): e is UnisexNoun {
    if (isPersonInput(e)) return false;
    if ("entry" in e) return false;
    return !!e.c?.includes("unisex");
}

export function isAdjectiveInput(e: EntityInput): e is Adjective {
    if (isPersonInput(e)) return false;
    if ("entry" in e) return false;
    if (isNounInput(e)) return false;
    if (isUnisexNounInput(e)) return false;
    if (isSpecifiedUnisexNounInput(e)) return false;
    return !!(e.c?.includes("adj.") && !(e.c.includes("n. m.") || e.c.includes("n. f.")));
}

