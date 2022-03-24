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

export function isMiniPronoun(ps: T.PsString | undefined): boolean {
    if (!ps) return false;
    return isInVerbBlock(ps.p, grammarUnits.pronouns.mini);
}

/**
 * returns true if the pashto text matches any item in a verb block
 * 
 * @param vb 
 */
function isInVerbBlock(p: string, vb: T.VerbBlock): boolean {
    return vb.some((r) => (
        r.some(x => x.some(y => y.p === p)   
    )));
}