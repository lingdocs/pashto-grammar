import Carousel from "./Carousel";
import {
    InlinePs,
    removeFVarients,
    InflectionsTable,
    inflectWord,
    defaultTextOptions as opts,
    getEnglishWord,
} from "@lingdocs/pashto-inflector";

function InflectionCarousel({ items }: { items: (NounEntry | AdjectiveEntry)[] }) {
    if (!items.length) {
        return "no items for carousel";
    }
    return (
        <div className="mt-3">
            <Carousel items={items} render={item => {
                const e = getEnglishWord(item);
                const english = e === undefined
                    ? item.e
                    : typeof e === "string"
                    ? e
                    : e.singular !== undefined
                    ? e.singular
                    : item.e;
                const infOut = inflectWord(item);
                if (!infOut || !infOut.inflections) {
                    return {
                        title: "Oops! 🤷‍♂️",
                        // @ts-ignore
                        body: <div>Oops! No inflections for <InlinePs opts={opts}>{item}</InlinePs></div>,
                    };
                }
                return {
                    // @ts-ignore
                    title: <InlinePs opts={opts} ps={{
                        ...removeFVarients(item),
                        e: english,
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