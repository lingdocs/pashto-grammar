import {
    Types as T,
    concatPsString,
    grammarUnits,
    psRemove,
} from "@lingdocs/pashto-inflector";
import { psStringEquals } from "@lingdocs/pashto-inflector/dist/lib/p-text-helpers";

export function getTenseVerbForm(conjR: T.VerbConjugation, tense: VerbTense | PerfectTense, tenseCategory: "basic" | "modal" | "perfect", voice: "active" | "passive"): T.VerbForm {
    const conj = (voice === "passive" && conjR.passive) ? conjR.passive : conjR;
    if (tenseCategory === "basic") {
        if (tense === "presentVerb") {
            return conj.imperfective.nonImperative;
        }
        if (tense === "subjunctiveVerb") {
            return conj.perfective.nonImperative;
        }
        if (tense === "imperfectiveFuture") {
            return conj.imperfective.future;
        }
        if (tense === "perfectiveFuture") {
            return conj.perfective.future;
        }
        if (tense === "imperfectivePast") {
            return conj.imperfective.past;
        }
        if (tense === "perfectivePast") {
            return conj.perfective.past;
        }
        if (tense === "habitualImperfectivePast") {
            return conj.imperfective.habitualPast;
        }
        if (tense === "habitualPerfectivePast") {
            return conj.perfective.habitualPast;
        }
    }
    if (tenseCategory === "modal") {
        if (tense === "presentVerb") {
            return conj.imperfective.modal.nonImperative;
        }
        if (tense === "subjunctiveVerb") {
            return conj.perfective.modal.nonImperative;
        }
        if (tense === "imperfectiveFuture") {
            return conj.imperfective.modal.future;
        }
        if (tense === "perfectiveFuture") {
            return conj.perfective.modal.future;
        }
        if (tense === "imperfectivePast") {
            return conj.imperfective.modal.past;
        }
        if (tense === "perfectivePast") {
            return conj.perfective.modal.past;
        }
        if (tense === "habitualImperfectivePast") {
            return conj.imperfective.modal.habitualPast;
        }
        if (tense === "habitualPerfectivePast") {
            return conj.perfective.modal.habitualPast;
        }
    }
    if (tense === "present perfect") {
        return conj.perfect.present;
    }
    if (tense === "past perfect") {
        return conj.perfect.past;
    }
    if (tense === "future perfect") {
        return conj.perfect.future;
    }
    if (tense === "habitual perfect") {
        return conj.perfect.habitual;
    }
    if (tense === "subjunctive perfect") {
        return conj.perfect.subjunctive;
    }
    if (tense === "wouldBe perfect") {
        return conj.perfect.affirmational;
    }
    if (tense === "pastSubjunctive perfect") {
        return conj.perfect.pastSubjunctiveHypothetical;
    }
    throw new Error("unknown tense");
}


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

export function removeDuplicates(psv: T.PsString[]): T.PsString[] {
    return psv.filter((ps, i, arr) => (
        i === arr.findIndex(t => (
            psStringEquals(t, ps)
        ))
    ));
}