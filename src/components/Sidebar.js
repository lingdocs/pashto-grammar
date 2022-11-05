/**
 * Copyright (c) 2021 lingdocs.com
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import SmoothCollapse from "react-smooth-collapse";

function Sidebar({ content, navOpen, setNavOpen, pathname }) {
    const openSection = content.find((block) => (
        block.content
            ? false
            : block.chapters.find((x) => pathname === x.path)
    ));
    const openSectionHeading = openSection ? openSection.heading : "";
    const [sectionOpen, setSectionOpen] = useState(openSectionHeading);
    function handleHeadingClick(h) {
        setSectionOpen(h === sectionOpen ? "" : h);
    }
    return (
        <>
            <aside className={classNames(
                "side-nav col-3 col-lg-2 p-0 bg-light",
                { "side-nav-closed": !navOpen }
            )}>
                <nav className="sticky-on-big flex-column align-items-start">
                        <Link to="/table-of-contents" style={{ textDecoration: "none", color: "inherit" }} onClick={() => setNavOpen(false)}>
                            <div className={classNames(
                                "side-nav-item",
                                { "side-nav-item-selected": pathname === "/table-of-contents" }
                            )}>
                                Table of Contents
                            </div>
                        </Link>
                        {content.map((item) => (
                            item.content
                            ? (
                                <Link key={item.path} to={item.path} style={{ textDecoration: "none", color: "inherit" }} onClick={() => setNavOpen(false)}>
                                    <div className={classNames(
                                        "side-nav-item",
                                        { "side-nav-item-selected": pathname === item.path }
                                    )}>
                                        {item.frontMatter.title}
                                    </div>
                                </Link>
                            )
                            : <div key={item.heading}>
                                <div className="side-nav-item" onClick={() => handleHeadingClick(item.heading)}>
                                    {item.heading}
                                </div>
                                <SmoothCollapse expanded={sectionOpen === item.heading}>
                                    <>
                                        {item.chapters.map((chapter) => (
                                            <Link key={chapter.path} to={chapter.path} style={{ textDecoration: "none" }} onClick={() => setNavOpen(false)}>
                                                <div className={classNames(
                                                    "side-nav-item side-nav-item-secondary",
                                                    { "side-nav-item-selected": pathname === chapter.path }
                                                )}>
                                                    {chapter.frontMatter.title}
                                                </div>
                                            </Link>
                                        ))}
                                    </>
                                </SmoothCollapse>
                            </div>
                        ))}
                </nav>
            </aside>
            <div
                className={classNames("overlay", { "overlay-showing": navOpen })}
                onClick={() => setNavOpen(false)}
            ></div>
        </>
    );
}

export default Sidebar;