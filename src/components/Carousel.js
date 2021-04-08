/**
 * Copyright (c) 2021 lingdocs.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from "react";
import leftChevron from "./chevron_left-24px.svg";
import rightChevron from "./chevron_right-24px.svg";

const chevStyle = {
    height: "3.5rem",
    width: "3.5rem",
};

export default function(props) {
    // console.log("pppp");
    // console.log(props.items);
    const [current, setCurrent] = useState(0);
    function forward() {
        setCurrent(
            (current + 1) % props.items.length
        );
    }
    function back() {
        setCurrent(
            current === 0 ? (props.items.length - 1) : current - 1
        );
    }
    const item = props.items[current];
    const { title, body } = props.render(item);
    if (!item) {
        return <div>EMPTY</div>;
    }
    return (
        <div className="mb-3">
            <div className="d-flex flex-row justify-content-between align-items-center">
                <img 
                    src={leftChevron}
                    className="clickable ml-lg-3"
                    style={chevStyle}
                    alt={"previous"}
                    onClick={back}
                />
                    {title ?
                        <div className="h5 text-center">{title}</div>
                        :
                        <div className="text-center">{body}</div>
                    }
                <img 
                    src={rightChevron}
                    className="clickable mr-lg-3"
                    style={chevStyle}
                    onClick={forward}
                    alt={"next"}
                /> 
            </div>
            {title && <div>
                {body}
            </div>}
        </div>
    )
}