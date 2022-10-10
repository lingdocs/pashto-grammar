import shuffle from "./shuffle-array";
import {
    Types as T,
} from "@lingdocs/ps-react";

export const startingWord = (words: Readonly<(T.NounEntry | T.AdjectiveEntry)[]>, p: string) => {
    const firstWord = words.find(w => w.p === p);
    return [
        ...firstWord ? [firstWord] : [],
        ...shuffle(words.filter(w => w.p !== p)),
    ];
}