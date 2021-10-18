import rawWords from "./raw-words";
import {
    isAdjective,
    isNoun,
    isVerb,
} from "../lib/type-predicates";
import { categorize } from "../lib/categorize";

const words = categorize<Word, Words>(rawWords, {
    "nouns": isNoun,
    "adjectives": isAdjective,
    "verbs": isVerb,
});

export default words;

export const { nouns, adjectives, verbs } = words;

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
