import shuffle from "./shuffle-array";

export const startingWord = (words: Readonly<(Noun | Adjective)[]>, p: string) => {
    const firstWord = words.find(w => w.p === p);
    return [
        ...firstWord ? [firstWord] : [],
        ...shuffle(words.filter(w => w.p !== p)),
    ];
}