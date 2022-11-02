const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path");
const wordsPath = path.join(".", "src", "words");
const wordsFile = "raw-words.ts";

const verbCollectionPath = path.join(wordsPath, "verb-categories");
const nounAdjCollectionPath = path.join(wordsPath, "noun-adj-categories");
const adverbCollectionPath = path.join(wordsPath, "adverbs");

const verbTsFiles = fs.readdirSync(verbCollectionPath);
const nounAdjTsFiles = fs.readdirSync(nounAdjCollectionPath);
const adverbTsFiles = fs.readdirSync(adverbCollectionPath);

const allVerbTsS = verbTsFiles.flatMap(fileName => [
    ...require(path.join("..", verbCollectionPath, fileName))
]).filter((v, i, a) => a.findIndex(x => x === v) === i);

const allNounAdjTsS = nounAdjTsFiles.flatMap(fileName => [
    ...require(path.join("..", nounAdjCollectionPath, fileName))
]).filter((v, i, a) => a.findIndex(x => x === v) === i);

const allAdverbTsS = adverbTsFiles.flatMap(fileName => [
    ...require(path.join("..", adverbCollectionPath, fileName))
]).filter((v, i, a) => a.findIndex(x => x === v) === i);

const allTs = [...allVerbTsS, ...allAdverbTsS, ...allNounAdjTsS];
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
  fs.writeFileSync(path.join(wordsPath, wordsFile), content);
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

