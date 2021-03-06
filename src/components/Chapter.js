/**
 * Copyright (c) 2021 lingdocs.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from "react";
import TableOfContents from "./TableOfContents";
import Footer from "./Footer";

const Chapter = ({ children: chapter }) => {
  const Content = chapter.content;
  return <>
    <main className="col bg-faded py-3 d-flex flex-column">
      <div className="flex-shrink-0">
        <h1>{chapter.frontMatter.title}</h1>
        <Content />
      </div>
      <Footer chapter={chapter} />
    </main>
    <TableOfContents tableOfContents={chapter.tableOfContents} />
  </>;
};

export default Chapter;
  