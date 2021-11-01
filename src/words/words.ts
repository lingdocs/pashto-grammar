import rawWords from "./raw-words";
import {
    isAdjectiveEntry,
    isNounEntry,
    isVerbEntry,
    isAdverbEntry,
} from "../lib/type-predicates";
import { categorize } from "../lib/categorize";

const words = categorize<Entry, Words>(rawWords, {
    "nouns": isNounEntry,
    "adjectives": isAdjectiveEntry,
    "verbs": isVerbEntry,
    "adverbs": isAdverbEntry,
});

export default words;

export const { nouns, adjectives, verbs, adverbs } = words;

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
