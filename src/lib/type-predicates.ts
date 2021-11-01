import {
    pashtoConsonants,
    endsWith,
    countSyllables,
    Types as T,
} from "@lingdocs/pashto-inflector";

export function isNounEntry(e: Entry): e is NounEntry {
    if ("entry" in e) return false;
    return !!(e.c && (e.c.includes("n. m.") || e.c.includes("n. f.")));
}

export function isAdjectiveEntry(e: Entry): e is AdjectiveEntry {
    if ("entry" in e) return false;
    return !!e.c?.includes("adj.") && !isNounEntry(e);
}

export function isAdverbEntry(e: Entry): e is AdverbEntry {
    if ("entry" in e) return false;
    return !!e.c?.includes("adv.");
}

export function isLocativeAdverbEntry(e: Entry): e is LocativeAdverbEntry {
    return isAdverbEntry(e) && e.c.includes("loc. adv.");
}

export function isNounOrAdjEntry(e: Entry): e is (NounEntry | AdjectiveEntry) {
    return isNounEntry(e) || isAdjectiveEntry(e);
}

export function isVerbEntry(e: Entry): e is VerbEntry {
    return "entry" in e && !!e.entry.c?.startsWith("v.");
}

export function isMascNounEntry(e: NounEntry | AdjectiveEntry): e is MascNounEntry {
    return !!e.c && e.c.includes("n. m.");
}

export function isFemNounEntry(e: NounEntry | AdjectiveEntry): e is FemNounEntry {
    return !!e.c && e.c.includes("n. f.");
}

export function isUnisexNounEntry(e: NounEntry | AdjectiveEntry): e is UnisexNounEntry {
    return isNounEntry(e) && e.c.includes("unisex");
}

export function isAdjOrUnisexNounEntry(e: Entry): e is (AdjectiveEntry | UnisexNounEntry) {
    return isAdjectiveEntry(e) || (
        isNounEntry(e) && isUnisexNounEntry(e)
    );
}

/**
 * shows if a noun/adjective has the basic (consonant / ه) inflection pattern
 * 
 * @param e 
 * @returns 
 */
export function isPattern1Entry<T extends (NounEntry | AdjectiveEntry)>(e: T): e is Pattern1Entry<T> {
    if (e.noInf) return false;
    if (e.infap) return false;
    if (isFemNounEntry(e)) {
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
export function isPattern2Entry<T extends (NounEntry | AdjectiveEntry)>(e: T): e is Pattern2Entry<T> {
    if (e.noInf) return false;
    if (e.infap) return false;
    if (isFemNounEntry(e)) {
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
export function isPattern3Entry<T extends (NounEntry | AdjectiveEntry)>(e: T): e is Pattern3Entry<T> {
    if (e.noInf) return false;
    if (e.infap) return false;
    if (isFemNounEntry(e)) {
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
export function isPattern4Entry<T extends (NounEntry | AdjectiveEntry)>(e: T): e is Pattern4Entry<T> {
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
export function isPattern5Entry<T extends (NounEntry | AdjectiveEntry)>(e: T): e is Pattern5Entry<T> {
    if (e.noInf) return false;
    return (
        !!(e.infap && e.infaf && e.infbp && e.infbf)
        &&
        (e.infaf.slice(-1) === "u")
        &&
        !e.infap.slice(1).includes("ا")
    );
}

export function isPattern6FemEntry(e: FemNounEntry): e is Pattern6FemEntry<FemNounEntry> {
    if (!isFemNounEntry(e)) return false;
    if (e.c.includes("anim.")) return false;
    return e.p.slice(-1) === "ي";
}

export function isPluralNounEntry<U extends NounEntry>(e: U): e is PluralNounEntry<U> {
    return e.c.includes("pl.");
}

export function isSingularEntry<U extends NounEntry>(e: U): e is SingularEntry<U> {
    return !isPluralNounEntry(e);
}

export function isArrayOneOrMore<U>(a: U[]): a is T.ArrayOneOrMore<U> {
    return a.length > 0;
}
