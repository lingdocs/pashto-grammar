/**
 * Copyright (c) 2021 lingdocs.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Route, withRouter, Switch } from "react-router-dom";
import "./App.css";
import Page404 from "./pages/404";
import Chapter from "./components/Chapter";
import { content } from "./content/index";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import TableOfContentsPage from "./pages/TableOfContentsPage";
import { useEffect } from "react";
import ReactGA from "react-ga";
const chapters = content.reduce((chapters, item) => (
  item.content
    ? [...chapters, item]
    : [...chapters, ...item.chapters]
), []);

const prod = document.location.hostname === "grammar.lingdocs.com";

if (prod) {
  ReactGA.initialize("UA-196576671-2");
  ReactGA.set({ anonymizeIp: true });
}

function App(props) {
  const [navOpen, setNavOpen] = useState(false);
  useEffect(() => {
    window.scroll(0, 0);
  }, [props.location.pathname]);
  return (
    <>
      <Header setNavOpen={setNavOpen} />
      <div className="container-fluid">
        <div className="main-row row">
          <Sidebar
            content={content}
            navOpen={navOpen}
            setNavOpen={setNavOpen}
            pathname={props.location.pathname}
          />
          <Switch>
            <Route path="/" exact>
              <TableOfContentsPage />
            </Route>
            {chapters.map((chapter) => (
              <Route key={chapter.path} path={chapter.path}>
                <Chapter>{chapter}</Chapter>
              </Route>
            ))}
            <Route component={Page404} />
          </Switch>
        </div>
      </div>
    </> 
  );
}

export default withRouter(App);
