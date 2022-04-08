import rawWords from "./raw-words";
import {
    typePredicates as tp,
    Types as T,
} from "@lingdocs/pashto-inflector";
import { categorize } from "../lib/categorize";

const words = categorize<T.Entry, T.Words>(rawWords, {
    "nouns": tp.isNounEntry,
    "adjectives": tp.isAdjectiveEntry,
    "verbs": tp.isVerbEntry,
    "adverbs": tp.isAdverbEntry,
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
