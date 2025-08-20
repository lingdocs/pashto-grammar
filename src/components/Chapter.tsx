/**
 * Copyright (c) 2021 lingdocs.com
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import TableOfContents from "./TableOfContents";
import Footer from "./Footer";
import ChapterFeedback from "./ChapterFeedback";
import { Helmet } from "react-helmet";
import type { ChapterData } from "../content";
// import { Comments } from "./Remark42";

const Chapter = ({ children: chapter }: { children: ChapterData }) => {
  const title = `${chapter.frontMatter.title} | LingDocs Pashto Grammar`;
  const url = "https://grammar.lingdocs.com" + chapter.path;
  const Content = chapter.content;
  function handleShare() {
    if (!navigator.share) {
      // should be impossible
      alert("Sorry, Sharing links are not supported on your device.");
      return;
    }
    navigator.share && navigator.share({ title, url });
  }
  return <>
    <Helmet>
      <link rel="canonical" href={url} />
      <meta name="twitter:title" content={title} />
      <meta name="og:title" content={title} />
      <title>{title}</title>
    </Helmet>
    <main className="col bg-faded py-3 d-flex flex-column" style={{ maxWidth: !chapter.frontMatter.fullWidth ? "700px" : undefined }}>
      <div className="flex-shrink-0">
        <div className="mb-2" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h1 data-testid="chapter-title">{chapter.frontMatter.title}</h1>
          {!!navigator.share && <div onClick={handleShare} className="clickable">
            <i className="fas fa-share-alt" style={{ fontSize: "1.8rem" }} />
          </div>}
        </div>
        <Content />
      </div>
      <ChapterFeedback chapter={chapter.path} />
      {/* <Comments id={chapter.path} /> */}
      <Footer chapter={chapter} />
    </main>
    {!chapter.frontMatter.fullWidth && <TableOfContents tableOfContents={chapter.tableOfContents} />}
  </>;
};

export default Chapter;

