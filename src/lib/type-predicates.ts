import {
    pashtoConsonants,
    endsWith,
    countSyllables,
    removeAccents,
} from "@lingdocs/pashto-inflector";

export function isNoun(e: Word): e is Noun {
    if ("entry" in e) return false;
    return !!(e.c && (e.c.includes("n. m.") || e.c.includes("n. f.")));
}

export function isAdjective(e: Word): e is Adjective {
    if ("entry" in e) return false;
    return !!e.c?.includes("adj.") && !isNoun(e);
}

export function isNounOrAdj(e: Word): e is (Noun | Adjective) {
    return isNoun(e) || isAdjective(e);
}

export function isVerb(e: Word): e is Verb {
    return "entry" in e && !!e.entry.c?.startsWith("v.");
}

export function isMascNoun(e: Noun | Adjective): e is MascNoun {
    return !!e.c && e.c.includes("n. m.");
}

export function isFemNoun(e: Noun | Adjective): e is FemNoun {
    return !!e.c && e.c.includes("n. f.");
}

export function isUnisexNoun(e: Noun | Adjective): e is UnisexNoun {
    return isNoun(e) && e.c.includes("unisex");
}

export function isAdjOrUnisexNoun(e: Word): e is (Adjective | UnisexNoun) {
    return isAdjective(e) || (
        isNoun(e) && isUnisexNoun(e)
    );
}

/**
 * shows if a noun/adjective has the basic (consonant / ه) inflection pattern
 * 
 * @param e 
 * @returns 
 */
export function isPattern1Word(e: Noun | Adjective): e is Pattern1Word {
    if (e.noInf) return false;
    if (e.infap) return false;
    if (isFemNoun(e)) {
        return endsWith({ p: "ه", f: "a" }, e) && (endsWith({ p: pashtoConsonants }, e) && e.c.includes("anim."));
    }
    return (
        endsWith([{ p: pashtoConsonants }], e) ||
        endsWith([{ p: "ه", f: "u" }, { p: "ه", f: "h" }], e) ||
        endsWith([{ p: "ای", f: "aay" }, { p: "وی", f: "ooy" }], e)
    );
}

/**
 * shows if a noun/adjective has the unstressed ی inflection pattern
 * 
 * @param e 
 * @returns 
 */
export function isPattern2Word(e: Noun | Adjective): e is Pattern2Word {
    if (e.noInf) return false;
    if (e.infap) return false;
    if (isFemNoun(e)) {
        return !e.c.includes("pl.") && endsWith({ p: "ې", f: "e" }, e, true);
    }
    // TODO: check if it's a single syllable word, in which case it would be pattern 1
    return endsWith({ p: "ی", f: "ey" }, e, true)//  && (countSyllables(e.f) > 1);
}

/**
 * shows if a noun/adjective has the stressed ی inflection pattern
 * 
 * @param e 
 * @returns 
 */
export function isPattern3Word(e: Noun | Adjective): e is Pattern3Word {
    if (e.noInf) return false;
    if (e.infap) return false;
    if (isFemNoun(e)) {
        return endsWith({ p: "ۍ" }, e);
    }
    return (countSyllables(removeAccents(e.f)) > 1)
        ? endsWith({ p: "ی", f: "éy" }, e, true)
        : endsWith({ p: "ی", f: "ey" }, e)
}

/**
 * shows if a noun/adjective has the "Pashtoon" inflection pattern
 * 
 * @param e 
 * @returns 
 */
export function isPattern4Word(e: Noun | Adjective): e is Pattern4Word {
    if (e.noInf) return false;
    return (
        !!(e.infap && e.infaf && e.infbp && e.infbf)
        &&
        (e.infap.slice(1).includes("ا") && e.infap.slice(-1) === "ه")
    );
}

/**
 * shows if a noun/adjective has the shorter squish inflection pattern
 * 
 * @param e 
 * @returns 
 */
export function isPattern5Word(e: Noun | Adjective): e is Pattern5Word {
    if (e.noInf) return false;
    return (
        !!(e.infap && e.infaf && e.infbp && e.infbf)
        &&
        (e.infaf.slice(-1) === "u")
        &&
        !e.infap.slice(1).includes("ا")
    );
}

export function isPattern6FemNoun(e: Noun): e is Pattern6FemNoun {
    if (!isFemNoun(e)) return false;
    if (e.c.includes("anim.")) return false;
    return e.p.slice(-1) === "ي";
}
