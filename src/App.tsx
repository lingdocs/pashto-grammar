/**
 * Copyright (c) 2021 lingdocs.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Route, withRouter, Switch, RouteComponentProps } from "react-router-dom";
import "./App.css";
import Page404 from "./pages/404";
import Chapter from "./components/Chapter";
import { content } from "./content/index";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import TableOfContentsPage from "./pages/TableOfContentsPage";
import AccountPage from "./pages/AccountPage";
import { useEffect } from "react";

import ReactGA from "react-ga";
import { useUser } from "./user-context";
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

function App(props: RouteComponentProps) {
  const [navOpen, setNavOpen] = useState(false);
  const { user } = useUser();
  function logAnalytics() {
    if (prod && !(user?.admin)) {
      ReactGA.pageview(window.location.pathname);
    };
  }
  useEffect(() => {
    logAnalytics();
  }, []);
  useEffect(() => {
    window.scroll(0, 0);
    logAnalytics();
  }, [props.location.pathname, user]);
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
            {chapters.map((chapter: any) => (
              <Route key={chapter.path} path={chapter.path}>
                <Chapter>{chapter}</Chapter>
              </Route>
            ))}
            <Route path="/account" exact>
              <AccountPage />
            </Route>
            <Route component={Page404} />
          </Switch>
        </div>
      </div>
    </> 
  );
}

export default withRouter(App);
