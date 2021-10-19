const fs = require("fs");
const fetch = require("node-fetch");
const { readDictionary } = require("@lingdocs/pashto-inflector");
const path = require("path");
const wordsPath = path.join(".", "src", "words");
const wordsFile = "raw-words.ts";
const verbCollectionPath = path.join(wordsPath, "verb-categories");
const nounAdjCollectionPath = path.join(wordsPath, "noun-adj-categories");
const verbTsFiles = fs.readdirSync(verbCollectionPath);
const nounAdjTsFiles = fs.readdirSync(nounAdjCollectionPath);

const allVerbTsS = verbTsFiles.flatMap(fileName => [
    ...require(path.join("..", verbCollectionPath, fileName)).map(x => x.ts)
]).filter((v, i, a) => a.findIndex(x => x === v) === i);

const allNounAdjTsS = nounAdjTsFiles.flatMap(fileName => [
    ...require(path.join("..", nounAdjCollectionPath, fileName)).map(x => x.ts)
]).filter((v, i, a) => a.findIndex(x => x === v) === i);

console.log("getting words from dictionary...");

fetch(process.env.LINGDOCS_DICTIONARY_URL).then(res => res.arrayBuffer()).then(buffer => {
  const dictionary = readDictionary(buffer);
  const entries = dictionary.entries;
  // MAKE VERBS FILE
  const allWords = [
      ...getVerbsFromTsS(entries),
      ...getNounsAdjsFromTsS(entries),
    ];
  const content = `
// @ts-ignore
const words: Word[] = ${JSON.stringify(allWords)};
export default words;`;
  fs.writeFileSync(path.join(wordsPath, wordsFile), content);
});

function getVerbsFromTsS(entries) {
    const missingEc = [];
    const toReturn = allVerbTsS.map(ts => {
        const entry = entries.find(x => ts === x.ts);
        if (!entry) {
            console.log("couldn't find ts", ts);
            return undefined;
        }
        if (!entry.ec) {
            missingEc.push(entry.ts);
        }
        if (entry.c && entry.c.includes("comp.")) {
            const complement = entries.find(x => entry.l === x.ts);
            return {
                entry,
                complement,
            };
        }
        return { entry };
    }).filter(x => x);
    if (missingEc.length !== 0) {
        console.log("Verbs missing ec:", missingEc);
    }
    return toReturn;
}

function getNounsAdjsFromTsS(entries) {
    const b = allNounAdjTsS.map(ts => {
        const entry = entries.find(x => ts === x.ts);
        if (!entry) {
            console.log("couldn't find ts", ts);
            return undefined;
        }
        // const firstWord = entry.e.split(",")[0].split(";")[0].split("(")[0].trim();
        // console.log(firstWord, entry.f, entry.ts);
        // if (firstWord.contains(" ")) console.log("SPACE PRESENT");
        return entry;
    }).filter(x => x);
    return b;
    // console.log(b.length, "number of nouns/adjs");
}
