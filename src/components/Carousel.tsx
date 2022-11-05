/**
 * Copyright (c) 2021 lingdocs.com
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import leftChevron from "./chevron_left-24px.svg";
import rightChevron from "./chevron_right-24px.svg";

const chevStyle = {
    height: "3.5rem",
    width: "3.5rem",
};

export default function Carousel<T>(props: {
    items: Array<T>,
    render: (item: T) => { title: JSX.Element | string, body: JSX.Element | string },
    stickyTitle?: boolean,
}): JSX.Element {
    // console.log("pppp");
    // console.log(props.items);
    const [current, setCurrent] = useState(0);
    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => forward(),
        onSwipedRight: () => back(),
    });
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
        <div className="mb-3" {...swipeHandlers}>
            <div className={props.stickyTitle ? "position-sticky" : ""} style={props.stickyTitle ? { top: 0, background: "white", zIndex: 2000 } : {}}>
                <div className="d-flex flex-row justify-content-between align-items-center">
                    <img 
                        src={leftChevron}
                        className="clickable ml-lg-3"
                        style={chevStyle}
                        alt={"previous"}
                        onClick={back}
                    />
                    {title ?
                        <div className="h5">{title}</div>
                        :
                        <div>{body}</div>
                    }
                    <img 
                        src={rightChevron}
                        className="clickable mr-lg-3"
                        style={chevStyle}
                        onClick={forward}
                        alt={"next"}
                    /> 
                </div>
            </div>
            {title && <div className="text-center">
                {body}
            </div>}
        </div>
    )
}