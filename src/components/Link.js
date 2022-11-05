/**
 * Copyright (c) 2021 lingdocs.com
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HashLink } from 'react-router-hash-link';
import { Link } from "react-router-dom";
// import scrollWithOffset from "../../lib/scroll-with-offset.js";

export default function L(props) {
    const { to } = props || "";
    const toA = (to.includes("#") && to.split("#")[0] === window.location.pathname)
        ? ("#" + to.split("#")[1])
        : to;
    if (toA.includes("#")) {
        // If it's a hash link return the special hash link
        return <HashLink
            // scroll={scrollWithOffset}
            smooth
            to={to}
            style={props.style}
        >{props.children}</HashLink>;
    }
    if (toA.startsWith("http")) {
        return <a href={toA} style={props.style} className={props.className}>{props.children}</a>
    }
    // If it's a regular link return the regular router linker
    return <Link to={toA} style={props.style} className={props.className}>{props.children}</Link>;
}; 