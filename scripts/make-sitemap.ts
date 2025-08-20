import { writeFileSync } from "fs";
import { getUrls } from "./get-urls-from-content-tree";
import { XMLBuilder } from "fast-xml-parser";

const urls = getUrls("https://grammar.lingdocs.com");
const obj = {
  urlset: {
    "@_xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
    url: urls.map((loc) => ({ loc })),
  },
};
const builder = new XMLBuilder({
  format: true,
  ignoreAttributes: false,
  suppressEmptyNode: true,
});

const xmlContent =
  '<?xml version="1.0" encoding="UTF-8"?>\n' + builder.build(obj);

writeFileSync("./public/sitemap.xml", xmlContent);
