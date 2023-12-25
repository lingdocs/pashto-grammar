import fs from "fs";

const base = "https://grammar.lingdocs.com";

console.log("generating sitemap.xml");

const indexText = fs.readFileSync("./src/content/index.ts", "utf-8");
const contentTreeRaw = indexText.split("/* content-tree */")[1];
const safeContentTreeText = contentTreeRaw
  .split("\n")
  .filter((l) => !l.includes(`"import":`))
  .join("\n");
const contentTree = JSON.parse(safeContentTreeText);

const urls = contentTree.reduce(
  (acc, section) => {
    if ("slug" in section) {
      return [...acc, `${base}/${section.slug}/`];
    } else {
      return [
        ...acc,
        ...section.chapters.map(
          (x) => `${base}/${section.subdirectory}/${x.slug}/`
        ),
      ];
    }
  },
  [`${base}`]
);

const siteMap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `   <url>
        <loc>${u}</loc>
    </url>    
`
  )
  .join("")}
</urlset>
`;

fs.writeFileSync("./public/sitemap.xml", siteMap);
