/**
 * Copyright (c) 2021 lingdocs.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Link } from "react-router-dom";
const hamburger = <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>

function Header({ setNavOpen }) {
    return (
        <header className="d-flex flex-row align-items-center p-2 bg-white border-bottom shadow-sm">
            <div className="side-nav-btn">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setNavOpen(true)}>
                    {hamburger}
                </button>
            </div>
            <h4 className="header-title link-unstyled mt-2"><Link to="/">Pashto Grammar</Link></h4>
        </header>
    );
}

export default Header;