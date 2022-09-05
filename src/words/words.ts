import rawWords from "./raw-words";
import {
    removeAccents,
    removeFVarients,
    typePredicates as tp,
    Types as T,
} from "@lingdocs/pashto-inflector";
import { categorize } from "../lib/categorize";

const words = categorize<T.Entry, {
    nouns: T.NounEntry[],
    adjectives: T.AdjectiveEntry[],
    verbs: T.VerbEntry[],
    adverbs: T.AdverbEntry[],
    locativeAdverbs: T.LocativeAdverbEntry[],
}>(rawWords, {
    nouns: tp.isNounEntry,
    adjectives: tp.isAdjectiveEntry,
    verbs: tp.isVerbEntry,
    adverbs: tp.isAdverbEntry,
    locativeAdverbs: tp.isLocativeAdverbEntry,
});

export default words;

export const { nouns, adjectives, verbs, adverbs, locativeAdverbs } = words;

export function wordQuery(category: "nouns", w: string[]): T.NounEntry[];
export function wordQuery(category: "adjectives", w: string[]): T.AdjectiveEntry[];
export function wordQuery(category: "adverbs", w: string[]): T.AdverbEntry[];
export function wordQuery(category: "locativeAdverbs", w: string[]): T.LocativeAdverbEntry[];
export function wordQuery(category: "nouns" | "adjectives" | "adverbs" | "locativeAdverbs", w: string[]): T.NounEntry[] | T.AdjectiveEntry[] | T.AdverbEntry[] | T.LocativeAdverbEntry[] {
    function wMatches(x: T.DictionaryEntry, y: string) {
        return (y === x.p) 
            || (removeAccents(y) === removeAccents(removeFVarients(x.f)));
    }
    return w.map(word => {
        const l = words[category];
        // @ts-ignore
        const found = l.find(x => wMatches(x, word));
        if (!found) throw new Error(`${word} not found by wordQuery`);
        return found;
    });
}

// console.log(
//     Object.entries(
//         intoPatterns([
//         ...words.nouns,
//         ...words.adjectives
//         ])
//     ).reduce((ob, [key, arr]) => {
//         return {
//             ...ob,
//             // @ts-ignore
//             [key]: arr.map(a => a.f),
//         };
//     }, {})
// );
