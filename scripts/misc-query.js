const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path");
const { readDictionary } = require("@lingdocs/pashto-inflector");
const verbsPath = path.join(".", "src", "words");

fetch(process.env.LINGDOCS_DICTIONARY_URL).then(res => res.arrayBuffer()).then(data => {
  const { entries } = readDictionary(data);
  const filtered = entries.filter(e => (
    e.c?.includes("loc. adv.")
  ));
  const content = `module.exports = [
${filtered.reduce((text, entry) => (
    text + `{ ts: ${entry.ts}, e: \`${entry.e.replace(/"/g, '\\"')}\` }, // ${entry.p} - ${entry.f}
`), "")}
];`;
  fs.writeFileSync(path.join(verbsPath, "query-results.js"), content);
});
