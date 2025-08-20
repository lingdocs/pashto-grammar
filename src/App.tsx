/**
 * Copyright (c) 2021 lingdocs.com
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router";
import "./App.css";
import Page404 from "./pages/FourOFour";
import Chapter from "./components/Chapter";
import type { ChapterData } from "./content/index";
import { content } from "./content/index";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import TableOfContentsPage from "./pages/TableOfContentsPage";
import LandingPage from "./pages/LandingPage";
import AccountPage from "./pages/AccountPage";
import { useEffect } from "react";
import { isProd } from "./lib/isProd";
import ReactGA from "react-ga4";
import { useUser } from "./user-context";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import SearchPage from "./pages/SearchPage";

const chapters = content.reduce<ChapterData[]>(
  (chapters, item) =>
    item.type === "chapter-data" ? [...chapters, item] : [...chapters, ...item.chapters],
  []
);

if (isProd) {
  ReactGA.initialize("G-KY970171QR");
  ReactGA.set({ anonymizeIp: true });
}

function App() {
  const [navOpen, setNavOpen] = useState(false);
  // const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user } = useUser();
  function logAnalytics() {
    if (isProd && !user?.admin) {
      ReactGA.send({
        hitType: "pageview",
        page: window.location.pathname,
      });
    }
  }
  useEffect(() => {
    logAnalytics();
    if (window.location.pathname === "/") {
      if (localStorage.getItem("visitedOnce")) {
        navigate("/table-of-contents", { replace: true });
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
  return (
    <>
      <Header setNavOpen={setNavOpen} />
      <div className="container-fluid">
        <div
          className="main-row row"
          style={{ minHeight: "calc(100vh - 62px)" }}
        >
          <Sidebar
            content={content}
            navOpen={navOpen}
            setNavOpen={setNavOpen}
            pathname={window.location.pathname}
          />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route
              path="/table-of-contents"
              element={<TableOfContentsPage />}
            />
            {chapters.map((chapter) => (
              <Route
                key={chapter.path}
                path={chapter.path}
                element={<Chapter>{chapter}</Chapter>}
              />
            ))}
            <Route path="/account" element={<AccountPage />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
