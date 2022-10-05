/**
 * Copyright (c) 2021 lingdocs.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { Route, withRouter, Switch, RouteComponentProps } from "react-router-dom";
import "./App.css";
import Page404 from "./pages/404";
import Chapter from "./components/Chapter";
import { content } from "./content/index";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import TableOfContentsPage from "./pages/TableOfContentsPage";
import LandingPage from "./pages/LandingPage";
import AccountPage from "./pages/AccountPage";
import { useEffect } from "react";
import { isProd } from "./lib/isProd";

import ReactGA from "react-ga";
import { useUser } from "./user-context";
import PrivacyPolicy from "./pages/PrivacyPolicy";
const chapters = content.reduce((chapters, item) => (
  item.content
    ? [...chapters, item]
    : [...chapters, ...item.chapters]
), []);

if (isProd) {
  ReactGA.initialize("UA-196576671-2");
  ReactGA.set({ anonymizeIp: true });
}

function App(props: RouteComponentProps) {
  const [navOpen, setNavOpen] = useState(false);
  const { user } = useUser();
  function logAnalytics() {
    if (isProd && !(user?.admin)) {
      ReactGA.pageview(window.location.pathname);
    };
  }
  useEffect(() => {
    logAnalytics();
    if (props.location.pathname === "/") {
      if (localStorage.getItem("visitedOnce")) {
        props.history.replace("/table-of-contents");
      } else {
        localStorage.setItem("visitedOnce", "true");
      }
    }
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    window.scroll(0, 0);
    logAnalytics();
    // eslint-disable-next-line
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
              <LandingPage />
            </Route>
            <Route path="/privacy" exact>
              <PrivacyPolicy />
            </Route>
            <Route path="/table-of-contents" exact>
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
