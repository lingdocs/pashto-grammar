/**
 * Copyright (c) 2021 lingdocs.com
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
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
// import algoliasearch from "algoliasearch";

// const client = algoliasearch('M5GQZF38JA', '1e3b529b909acf72fde1515f520f3913');
// const index = client.initIndex('netlify_150beb8b-aae1-4cef-a05c-2add5d8904f7_master_all');

const chapters = content.reduce((chapters, item) => (
  item.content
    ? [...chapters, item]
    : [...chapters, ...item.chapters]
), []);

if (isProd) {
  ReactGA.initialize("UA-196576671-2");
  ReactGA.set({ anonymizeIp: true });
}

function App() {
  const [navOpen, setNavOpen] = useState(false);
  // const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user } = useUser();
  function logAnalytics() {
    if (isProd && !(user?.admin)) {
      ReactGA.pageview(window.location.pathname);
    };
  }
  useEffect(() => {
    logAnalytics();
    if (window.location.pathname === "/") {
      if (localStorage.getItem("visitedOnce")) {
        navigate("/table-of-contents", { replace: true })
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
  }, [window.location.pathname]);
  // function handleSearch(s: string) {
  //   setSearch(s);
  //   index.search(s, {
  //     attributesToSnippet: [
  //       "content:20",
  //     ],
  //   }).then(({ hits }) => {
  //     console.log(hits);
  //   });
  // }
  return (
    <>
      <Header setNavOpen={setNavOpen} />
      <div className="container-fluid">
        <div className="main-row row">
          <Sidebar
            content={content}
            navOpen={navOpen}
            setNavOpen={setNavOpen}
            pathname={window.location.pathname}
          />
          {/* <input type="text" onChange={e => handleSearch(e.target.value)} value={search} /> */}
          <Routes>
            <Route
              path="/"
              element={<LandingPage />}
            />
            <Route
              path="/privacy"
              element={<PrivacyPolicy />}
            />
            <Route
              path="/table-of-contents"
              element={<TableOfContentsPage />}
            />
            {chapters.map((chapter: any) => (
              <Route
                key={chapter.path}
                path={chapter.path}
                element={<Chapter>{chapter}</Chapter>}
              />
            ))}
            <Route
              path="/account"
              element={<AccountPage />}
            />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </div>
      </div>
    </> 
  );
}

export default App;
