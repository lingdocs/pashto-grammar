import { isMascNounEntry, isPluralNounEntry, isUnisexNounEntry } from "./type-predicates";
import { 
    Types as T,
    getEnglishWord,
    parseEc,
    getVerbBlockPosFromPerson,
    grammarUnits,
    inflectWord,
} from "@lingdocs/pashto-inflector";
import {
    psStringFromEntry,
} from "./text-tools";

function getRandPers(): T.Person {
    return Math.floor(Math.random() * 12);
}

export function randomPerson(a?: { prev?: T.Person, counterPart?: VerbObject | NPSelection }) {
    // no restrictions, just get any person
    if (!a) {
        return getRandPers();
    }
    if (a.counterPart !== undefined && typeof a.counterPart === "object" && a.counterPart.type === "pronoun") {
        // with counterpart pronoun
        let newP = 0;
        do {
            newP = getRandPers();
        } while (
            isInvalidSubjObjCombo(a.counterPart.person, newP)
            ||
            (newP === a.prev)
        );
        return newP;
    }
    // without counterpart pronoun, just previous
    let newP = 0;
    do {
        newP = getRandPers();
    } while (newP === a.prev);
    return newP;
}

export function isInvalidSubjObjCombo(subj: T.Person, obj: T.Person): boolean {
    const firstPeople = [
        T.Person.FirstSingMale,
        T.Person.FirstSingFemale,
        T.Person.FirstPlurMale,
        T.Person.FirstPlurFemale,
    ];
    const secondPeople = [
        T.Person.SecondSingMale,
        T.Person.SecondSingFemale,
        T.Person.SecondPlurMale,
        T.Person.SecondPlurFemale,
    ];
    return (
        (firstPeople.includes(subj) && firstPeople.includes(obj))
        ||
        (secondPeople.includes(subj) && secondPeople.includes(obj))
    );
}

export function randomSubjObj(old?: { subj: T.Person, obj: T.Person }): { subj: T.Person, obj: T.Person } {
    let subj = 0;
    let obj = 0;
    do {
        subj = getRandPers();
        obj = getRandPers();
    } while (
        (old && ((old.subj === subj) || (old.obj === obj)))
        ||
        isInvalidSubjObjCombo(subj, obj)
    );
    return { subj, obj };
}

export function personFromNP(np: NounPhrase): T.Person {
    if (np.type === "participle") {
        return T.Person.ThirdPlurMale;
    }
    if (np.type === "pronoun") {
        return np.person;
    }
    const gender = nounGender(np);
    const number = nounNumber(np);
    return number === "plural"
        ? (gender === "masc" ? T.Person.ThirdPlurMale : T.Person.ThirdPlurFemale)
        : (gender === "masc" ? T.Person.ThirdSingMale : T.Person.ThirdSingFemale);
}

export function evaluateNP(np: NounPhrase): { ps: T.PsString[], e: string } {
    if (np.type === "participle") {
        return evaluateParticiple(np);
    }
    if (np.type === "pronoun") {
        return evaluatePronoun(np);
    }
    return evaluateNoun(np);
}

function nounGender(n: Noun): T.Gender {
    const nGender = isUnisexNounEntry(n.entry)
        ? "unisex"
        : isMascNounEntry(n.entry)
        ? "masc"
        : "fem";
    return (nGender === "unisex" && n.gender)
        ? n.gender
        : (nGender === "unisex")
        ? "masc"
        : nGender;
}

function nounNumber(n: Noun): NounNumber {
    const nNumber = isPluralNounEntry(n.entry)
        ? "plural"
        : "singular";
    return nNumber === "plural"
        ? "plural"
        : n.number
        ? n.number
        : nNumber;
}

function evaluatePronoun(p: Pronoun): { ps: T.PsString[], e: string } {
    // TODO: Will need to handle inflecting and inflecting english pronouns etc.
    const [row, col] = getVerbBlockPosFromPerson(p.person);
    return {
        ps: grammarUnits.pronouns[p.pronounType].plain[row][col],
        e: grammarUnits.persons[p.person].label.subject,
    };
}

function evaluateNoun(n: Noun): { ps: T.PsString[], e: string } {
    const number = nounNumber(n);
    const english = getEnglishFromNoun(n.entry, number);
    const pashto = ((): T.PsString[] => {
        const infs = inflectWord(n.entry);
        const gender = nounGender(n);
        const ps = number === "singular"
            ? getInf(infs, "inflections", gender, false)
            : [
                ...getInf(infs, "plural", gender, true),
                ...getInf(infs, "arabicPlural", gender, true),
                ...getInf(infs, "inflections", gender, true),
            ];
        return ps.length > 0
            ? ps
            : [psStringFromEntry(n.entry)];
    })();
    return { ps: pashto, e: english };
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

export function getEnglishVerb(entry: T.DictionaryEntry): string {
    if (!entry.ec) {
        console.log("errored verb");
        console.log(entry);
        throw new Error("no english information for verb");
    }
    if (entry.ep) {
        const ec = entry.ec.includes(",") ? parseEc(entry.ec)[0] : entry.ec;
        return `to ${ec} ${entry.ep}`;
    }
    const ec = parseEc(entry.ec);
    return `to ${ec[0]}`;
}

export function getEnglishParticiple(entry: T.DictionaryEntry): string {
    if (!entry.ec) {
        console.log("errored participle");
        console.log(entry);
        throw new Error("no english information for participle");
    }
    const ec = parseEc(entry.ec);
    const participle = ec[2];
    return (entry.ep)
        ? `${participle} ${entry.ep}`
        : participle;
}

function evaluateParticiple({ entry: { entry }}: Participle): { ps: T.PsString[], e: string } {
    return {
        ps: [psStringFromEntry(entry)],
        e: getEnglishParticiple(entry),
    };
}

function getEnglishFromNoun(entry: T.DictionaryEntry, number: NounNumber): string {
    const articles = {
        singular: "(a/the)",
        plural: "(the)",
    };
    const article = articles[number];
    function addArticle(s: string) {
        return `${article} ${s}`;
    }
    const e = getEnglishWord(entry);
    if (!e) throw new Error(`unable to get english from subject ${entry.f} - ${entry.ts}`);

    if (typeof e === "string") return ` ${e}`;
    if (number === "plural") return addArticle(e.plural);
    if (!e.singular || e.singular === undefined) {
        throw new Error(`unable to get english from subject ${entry.f} - ${entry.ts}`);
    }
    return addArticle(e.singular);
}

