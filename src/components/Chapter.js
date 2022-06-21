/**
 * Copyright (c) 2021 lingdocs.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import TableOfContents from "./TableOfContents";
import Footer from "./Footer";

const Chapter = ({ children: chapter }) => {
  const Content = chapter.content;
  function handleShare() {
    if (!navigator.share) {
      // should be impossible
      alert("Sorry, Sharing links are not supported on your device.", chapter.path);
      return;
    }
    navigator.share && navigator.share({
      title: chapter.frontMatter.title +  " | LingDocs Pashto Grammar",
      url: "https://grammar.lingdocs.com" + chapter.path,
    });
  }
  return <>
    <main className="col bg-faded py-3 d-flex flex-column" style={{ maxWidth: !chapter.frontMatter.fullWidth ? "850px" : undefined }}>
      <div className="flex-shrink-0">
        <div className="mb-2" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h1>{chapter.frontMatter.title}</h1>
            {navigator.share && <div onClick={handleShare} className="clickable">
              <i className="fas fa-share-alt" style={{ fontSize: "1.8rem" }} />
            </div>}
        </div>
        
        <Content />
      </div>
      <Footer chapter={chapter} />
    </main>
    {!chapter.frontMatter.fullWidth && <TableOfContents tableOfContents={chapter.tableOfContents} />}
  </>;
};

export default Chapter;
  