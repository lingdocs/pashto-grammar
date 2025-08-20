import fs from "fs";
import path from "path";
const verbsPath = path.join(".", "src", "words");
const pChars = [
  "آ",
  "ځ",
  "څ",
  "ښ",
  "ئ",
  "ي",
  "پ",
  "ټ",
  "ڼ",
  "ظ",
  "ط",
  "ژ",
  "ډ",
  "ض",
  "ص",
  "ث",
  "ق",
  "ف",
  "غ",
  "ع",
  "ه",
  "خ",
  "ح",
  "ج",
  "چ",
  "ش",
  "س",
  "ی",
  "ب",
  "ل",
  "ا",
  "ت",
  "ن",
  "م",
  "ک",
  "ګ",
  "ۍ",
  "ې",
  "ز",
  "ر",
  "ذ",
  "د",
  "ړ",
  "و",
  "ږ",
];

fetch(process.env.LINGDOCS_DICTIONARY_URL + ".json")
  .then((res) => res.json())
  .then((data) => {
    const { entries } = data;
    const filtered = shuffle(entries.filter((e) => e.c?.includes("adv.")));
    const content = `module.exports = [
${filtered.reduce(
  (text, entry) =>
    text +
    `{ ts: ${entry.ts}, e: \`${entry.e.replace(/"/g, '\\"')}\` }, // ${entry.p} - ${entry.f}
`,
  "",
)}
];`;
    //   const content = `export const WORDS = [
    // ${filtered.map((entry) => (entry.p.replace("آ", "ا"))).reduce((text, p) => (
    //   text + `"${p}",\n`
    // ), "")}
    // ];`;

    fs.writeFileSync(path.join(verbsPath, "wordle-words.ts"), content);
  });

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
