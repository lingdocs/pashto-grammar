import fs from "fs";
import fetch from "node-fetch";
import type { Types as T } from "@lingdocs/ps-react";

import nounAdjTs from "../src/words/nouns-adjs";
import verbs from "../src/words/verbs";
import adverbs from "../src/words/adverbs";

const wordsFile = "./src/words/raw-words.ts";

const allTs = [...nounAdjTs, ...verbs, ...adverbs];

async function main() {
  console.log("getting words from dictionary...");
  const res = await fetch("https://account.lingdocs.com/dictionary/entries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids: allTs }),
  });
  const data = (await res.json()) as {
    results: (T.DictionaryEntry | T.VerbEntry)[];
    notFound: unknown[];
  };
  const content = `
    // @ts-ignore
    const words = ${JSON.stringify(data.results)};
    export default words;`;
  fs.writeFileSync(wordsFile, content);
  const missingEc = data.results.filter((x) => "entry" in x && !x.entry.ec);
  if (missingEc.length) {
    console.log("verbs missing ec");
    console.log(missingEc);
    process.exit(1);
  }
  if (data.notFound.length) {
    console.log("entries not found:");
    console.log(data.notFound);
    process.exit(1);
  }
}

main();
