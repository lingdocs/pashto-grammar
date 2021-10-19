import {
    pashtoConsonants,
    endsWith,
    countSyllables,
    Types as T,
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
export function isPattern1Word<T extends (Noun | Adjective)>(e: T): e is Pattern1Word<T> {
    if (e.noInf) return false;
    if (e.infap) return false;
    if (isFemNoun(e)) {
        return (
            endsWith([{ p: "ه", f: "a" }, { p: "ح", f: "a" }], e) ||
            (endsWith({ p: pashtoConsonants }, e) && !e.c.includes("anim."))
        );
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
export function isPattern2Word<T extends (Noun | Adjective)>(e: T): e is Pattern2Word<T> {
    if (e.noInf) return false;
    if (e.infap) return false;
    if (isFemNoun(e)) {
        return !e.c.includes("pl.") && endsWith({ p: "ې", f: "e" }, e, true);
    }
    // TODO: check if it's a single syllable word, in which case it would be pattern 1
    return endsWith({ p: "ی", f: "ey" }, e, true) && (countSyllables(e.f) > 1);
}

/**
 * shows if a noun/adjective has the stressed ی inflection pattern
 * 
 * @param e 
 * @returns 
 */
export function isPattern3Word<T extends (Noun | Adjective)>(e: T): e is Pattern3Word<T> {
    if (e.noInf) return false;
    if (e.infap) return false;
    if (isFemNoun(e)) {
        return endsWith({ p: "ۍ" }, e);
    }
    return (countSyllables(e.f) > 1)
        ? endsWith({ p: "ی", f: "éy" }, e, true)
        : endsWith({ p: "ی", f: "ey" }, e)
}

/**
 * shows if a noun/adjective has the "Pashtoon" inflection pattern
 * 
 * @param e 
 * @returns 
 */
export function isPattern4Word<T extends (Noun | Adjective)>(e: T): e is Pattern4Word<T> {
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
export function isPattern5Word<T extends (Noun | Adjective)>(e: T): e is Pattern5Word<T> {
    if (e.noInf) return false;
    return (
        !!(e.infap && e.infaf && e.infbp && e.infbf)
        &&
        (e.infaf.slice(-1) === "u")
        &&
        !e.infap.slice(1).includes("ا")
    );
}

export function isPattern6FemNoun(e: FemNoun): e is Pattern6FemNoun<FemNoun> {
    if (!isFemNoun(e)) return false;
    if (e.c.includes("anim.")) return false;
    return e.p.slice(-1) === "ي";
}

export function isArrayOneOrMore<U>(a: U[]): a is T.ArrayOneOrMore<U> {
    return a.length > 0;
}
