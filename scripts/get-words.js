const fs = require("fs");
const fetch = require("node-fetch");
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

fetch(process.env.LINGDOCS_DICTIONARY_URL).then(res => res.json()).then(data => {
  const entries = data.entries;
  // MAKE VERBS FILE
  const allVerbs = getVerbsFromTsS(entries);
  const content = `const verbs = ${JSON.stringify(allVerbs)};
export default verbs;`;
  fs.writeFileSync(path.join(verbsPath, "verbs.js"), content);

  // MAKE NOUN-ADJ FILE
  const allNounsAdjs = getNounsAdjsFromTsS(entries);
  const content1 = `const nounsAdjs = ${JSON.stringify(allNounsAdjs)};
export default nounsAdjs;`;
  fs.writeFileSync(path.join(verbsPath, "nouns-adjs.js"), content1);
});

function getVerbsFromTsS(entries) {
    return allVerbTsS.map(item => {
        const entry = entries.find(x => item.ts === x.ts);
        if (!entry) {
            console.log("couldn't find ts", ts);
            return undefined;
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
}

function getNounsAdjsFromTsS(entries) {
    return allNounAdjTsS.map(item => {
        const entry = entries.find(x => item.ts === x.ts);
        if (!entry) {
            console.log("couldn't find ts", ts);
            return undefined;
        }
        return { entry, def: item.e, category: item.category };
    }).filter(x => x);
}
