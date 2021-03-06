/**
 * Copyright (c) 2021 lingdocs.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from "react";

export default function(props) {
    return (
        <samp>
            <span>Formula: </span>
            {props.children}
        </samp>
    );
}