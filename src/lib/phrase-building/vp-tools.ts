import {
    Types as T,
    concatPsString,
    grammarUnits,
    psRemove,
} from "@lingdocs/pashto-inflector";

export function getPersonFromNP(np: NPSelection): T.Person;
export function getPersonFromNP(np: NPSelection | ObjectNP): T.Person | undefined;
export function getPersonFromNP(np: NPSelection | ObjectNP): T.Person | undefined {
    if (np === "none") {
        return undefined;
    }
    if (typeof np === "number") return np;
    if (np.type === "participle") {
        return T.Person.ThirdPlurMale;
    }
    if (np.type === "pronoun") {
        return np.person;
    }
    return np.number === "plural"
        ? (np.gender === "masc" ? T.Person.ThirdPlurMale : T.Person.ThirdPlurFemale)
        : (np.gender === "masc" ? T.Person.ThirdSingMale : T.Person.ThirdSingFemale);
}

export function removeBa(ps: T.PsString): T.PsString {
    return psRemove(ps, concatPsString(grammarUnits.baParticle, " "));
}

export function isEquativeTense(t: VerbTense | EquativeTense | PerfectTense): t is EquativeTense {
    return (t === "present" || t === "future" || t === "habitual" || t === "past" || t === "wouldBe" || t === "subjunctive" || t === "pastSubjunctive");
}

export function isPerfectTense(t: VerbTense | EquativeTense | PerfectTense): t is PerfectTense {
    return (
        t === "present perfect" ||
        t === "habitual perfect" ||
        t === "future perfect" ||
        t === "past perfect" ||
        t === "wouldBe perfect" ||
        t === "subjunctive perfect" ||
        t === "pastSubjunctive perfect"
    );
}

export function isPastTense(tense: VerbTense | PerfectTense): boolean {
    if (isPerfectTense(tense)) return true;
    return tense.toLowerCase().includes("past");
}