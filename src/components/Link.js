/**
 * Copyright (c) 2021 lingdocs.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from "react";
import { HashLink } from 'react-router-hash-link';
import { Link } from "react-router-dom";
// import scrollWithOffset from "../../lib/scroll-with-offset.js";

export default function(props) {
    const { to } = props || "";
    if (to.includes("#")) {
        // If it's a hash link return the special hash link
        return <HashLink
            // scroll={scrollWithOffset}
            smooth
            to={to}
            style={props.style}
        >{props.children}</HashLink>;
    }
    // If it's a regular link return the regular router linker
    return <Link to={to} style={props.style}>{props.children}</Link>;
}; 