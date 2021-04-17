import shuffle from "./shuffle-array";

export const startingWord = (words, category, p) => {
    const ws = words.filter(w => w.category === category);
    return [
        ws.find(w => w.entry.p === p),
        ...shuffle(ws.filter(w => w.entry.p !== p)),
    ];
}