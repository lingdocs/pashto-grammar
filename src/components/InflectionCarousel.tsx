import Carousel from "./Carousel";
import type { Types as T } from "@lingdocs/ps-react";
import {
  InlinePs,
  removeFVarients,
  InflectionsTable,
  inflectWord,
  defaultTextOptions as opts,
  getEnglishWord,
} from "@lingdocs/ps-react";

function InflectionCarousel({
  items,
}: {
  items: (T.NounEntry | T.AdjectiveEntry)[];
}) {
  if (!items.length) {
    return "no items for carousel";
  }
  return (
    <div className="mt-3">
      <Carousel
        items={items}
        render={(item) => {
          const e = getEnglishWord(item);
          const english =
            e === undefined
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
              body: (
                <div>
                  Oops! No inflections for <InlinePs opts={opts} ps={item} />
                </div>
              ),
            };
          }
          return {
            // @ts-ignore
            title: (
              <InlinePs
                opts={opts}
                ps={{
                  ...removeFVarients(item),
                  e: english,
                }}
              />
            ),
            body: (
              <InflectionsTable inf={infOut.inflections} textOptions={opts} />
            ),
          };
        }}
      />
    </div>
  );
}

export default InflectionCarousel;
