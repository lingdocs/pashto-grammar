import React from "react";
import Carousel from "./Carousel";
import {
    InlinePs,
    removeFVarients,
    InflectionsTable,
    inflectWord,
    defaultTextOptions as opts,
} from "@lingdocs/pashto-inflector";

function InflectionCarousel({ items }: any) {
    return (
        <div className="mt-3">
            <Carousel items={items} render={(item: any) => {
                const infOut = inflectWord(item.entry);
                if (!infOut || !infOut.inflections) {
                    return (
                        // @ts-ignore
                        <div>Oops! No inflections for <InlinePs opts={opts} />{item.entry}</div>
                    );
                }
                return {
                    // @ts-ignore
                    title: <InlinePs opts={opts} ps={{
                        ...removeFVarients(item.entry),
                        e: item.def,
                    }} />,
                    body: <InflectionsTable
                        inf={infOut.inflections}
                        textOptions={opts}
                    />,
                };
            }}/>
        </div>
    );
}

export default InflectionCarousel;