import fs from "fs";
import fetch from "node-fetch";

import nounAdjTs from "../src/words/nouns-adjs.js";
import verbs from "../src/words/verbs.js";
import adverbs from "../src/words/adverbs.js";

const wordsFile = "./src/words/raw-words.ts";

const allTs = [...nounAdjTs, ...verbs, ...adverbs];
console.log("getting words from dictionary...");

fetch("https://account.lingdocs.com/dictionary/entries", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids: allTs }),
}).then(res => res.json()).then(data => {
  const content = `
// @ts-ignore
const words: Word[] = ${JSON.stringify(data.results)};
export default words;`;
  fs.writeFileSync(wordsFile, content);
  const missingEc = data.results.filter(x => "entry" in x && !x.entry.ec);
  if (missingEc.length) {
    console.log("verbs missing ec");
    console.log(missingEc);
  }
  if (data.notFound.length) {
    console.log("entries not found:");
    console.log(data.notFound);
  }
});

