import {
    Types as T,
    concatPsString,
    grammarUnits,
} from "@lingdocs/pashto-inflector";
import { psRemove } from "@lingdocs/pashto-inflector/dist/lib/p-text-helpers";

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