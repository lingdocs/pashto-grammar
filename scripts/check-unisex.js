const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path");
const verbsPath = path.join(".", "src", "words");
const collectionPath = path.join(verbsPath, "verb-categories");
const verbTsFiles = fs.readdirSync(collectionPath);

// const allTsS = [...new Set(verbTsFiles.reduce((arr, fileName) => {
//     const TsS = require(path.join("..", collectionPath, fileName));
//     return [...arr, ...TsS];
// }, []))];

fetch(process.env.LINGDOCS_DICTIONARY_URL).then(res => res.json()).then(data => {
  const entries = data.entries;
  const myWords = require(path.join("..", verbsPath, "my-words.js"));
  const bad = myWords.filter((word) => {
    const dictEntry = entries.find(e => e.ts === word.ts);
    if (!dictEntry) {
      return true;
    }
    if (!dictEntry.c) {
      return true;
    }
    if (!dictEntry.c.includes("adj.") && !dictEntry.c.includes("unisex")) {
      return true;
    }
    return false;
  })
  console.log(bad);
});

// function getFromTsS(entries) {
//     return allTsS.map(item => {
//         const entry = entries.find(x => item.ts === x.ts);
//         if (!entry) {
//             console.log("couldn't find ts", ts);
//             return undefined;
//         }
//         if (entry.c && entry.c.includes("comp.")) {
//             const complement = entries.find(x => entry.l === x.ts);
//             return {
//                 entry,
//                 complement,
//             };
//         }
//         return { entry, def: item.e };
//     }).filter(x => x);
// }
