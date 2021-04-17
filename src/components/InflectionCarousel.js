import React from "react";
import Carousel from "./Carousel";
import {
    InlinePs,
    removeFVariants,
    InflectionsTable,
    inflectWord,
    defaultTextOptions as opts,
} from "@lingdocs/pashto-inflector";

function InflectionCarousel({ items }) {
    return (
        <div className="mt-3">
            <Carousel items={items} render={(item) => {
                const inf = inflectWord(item.entry);
                if (!inf) {
                    return (
                        <div>Oops! No inflections for <InlinePs opts={opts} ps={item.entry} /></div>
                    );
                }
                return {
                    title: <InlinePs opts={opts} ps={{
                        ...removeFVariants(item.entry),
                        e: item.def,
                    }} />,
                    body: <InflectionsTable
                        inf={inf}
                        textOptions={opts}
                    />,
                };
            }}/>
        </div>
    );
}

export default InflectionCarousel;