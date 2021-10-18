import rawWords from "./raw-words";
import {
    isAdjective,
    // isFemNoun,
    // isMascNoun,
    isNoun,
    isVerb,
} from "../lib/type-predicates";
import { categorize, intoPatterns } from "../lib/categorize";

export const words = categorize<Word, Words>(rawWords, {
    "nouns": isNoun,
    "adjectives": isAdjective,
    "verbs": isVerb,
});

console.log(
    Object.entries(
        intoPatterns([
        ...words.nouns,
        ...words.adjectives
        ])
    ).reduce((ob, [key, arr]) => {
        return {
            ...ob,
            [key]: arr.map(a => `${a.f} - ${a.p} - ${a.c}`),
        };
    }, {})
);

// const genderedNouns = categorize<Noun, { masc: MascNoun[], fem: FemNoun[] }>(
//     words.nouns,
//     {
//         "masc": isMascNoun,
//         "fem": isFemNoun,
//     },
// );

// console.log(genderedNouns);

