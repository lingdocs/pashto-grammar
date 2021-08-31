const fs = require("fs");
const fetch = require("node-fetch");
const { readDictionary } = require("@lingdocs/pashto-inflector");
const path = require("path");
const verbsPath = path.join(".", "src", "words");
const verbCollectionPath = path.join(verbsPath, "verb-categories");
const nounAdjCollectionPath = path.join(verbsPath, "noun-adj-categories");
const verbTsFiles = fs.readdirSync(verbCollectionPath);
const nounAdjTsFiles = fs.readdirSync(nounAdjCollectionPath);

const allVerbTsS = [...new Set(verbTsFiles.reduce((arr, fileName) => {
    const TsS = require(path.join("..", verbCollectionPath, fileName));
    return [...arr, ...TsS];
}, []))];

const allNounAdjTsS = [...new Set(nounAdjTsFiles.reduce((arr, fileName) => {
    const TsS = require(path.join("..", nounAdjCollectionPath, fileName));
    return [...arr, ...TsS.map(x => ({ ...x, category: path.parse(fileName).name }))];
}, []))];

console.log("getting words from dictionary...");

fetch(process.env.LINGDOCS_DICTIONARY_URL).then(res => res.arrayBuffer()).then(buffer => {
  const dictionary = readDictionary(buffer);
  const entries = dictionary.entries;
  // MAKE VERBS FILE
  const allVerbs = getVerbsFromTsS(entries);
  const content = `const verbs = ${JSON.stringify(allVerbs)};
export default verbs;`;
  fs.writeFileSync(path.join(verbsPath, "verbs.js"), content);

  // MAKE NOUN-ADJ FILE
  const allNounsAdjs = getNounsAdjsFromTsS(entries);
  const content1 = `import { Types as T } from "@lingdocs/pashto-inflector";
const nounsAdjs: { entry: T.DictionaryEntry, def: string, category: string }[] = ${JSON.stringify(allNounsAdjs)};
export default nounsAdjs;`;
  fs.writeFileSync(path.join(verbsPath, "nouns-adjs.ts"), content1);
});

function getVerbsFromTsS(entries) {
    const missingEc = [];
    const toReturn = allVerbTsS.map(item => {
        const entry = entries.find(x => item.ts === x.ts);
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
        return { entry, def: item.e };
    }).filter(x => x);
    if (missingEc.length !== 0) {
        console.log("Verbs missing ec:", missingEc);
    }
    return toReturn;
}

function getNounsAdjsFromTsS(entries) {
    return allNounAdjTsS.map(item => {
        const entry = entries.find(x => item.ts === x.ts);
        if (!entry) {
            console.log("couldn't find ts", item);
            return undefined;
        }
        return { entry, def: item.e, category: item.category };
    }).filter(x => x);
}
