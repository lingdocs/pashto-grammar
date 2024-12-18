import { InlinePs, Types as T } from "@lingdocs/ps-react";
import { useState } from "react";
// @ts-ignore
import SmoothCollapse from "react-smooth-collapse";

export default function MinimalPairs({
  opts,
  section,
}: {
  opts: T.TextOptions;
  section: {
    title: string;
    pairs: { f: string; entry: T.DictionaryEntry }[][];
  };
}) {
  const [opened, setOpened] = useState<boolean>(false);
  return (
    <div>
      <h5 className="my-3" onClick={() => setOpened((x) => !x)}>
        {opened ? "▼" : "▶"} View Pairs
      </h5>
      <SmoothCollapse expanded={opened}>
        {section.pairs.map((pairs, i) => (
          <div className="row mb-3" key={`${section.title}-${i}`}>
            {pairs.map((e, j) => (
              <PairItem
                entry={e}
                opts={opts}
                key={`${section.title}-${i}-${j}`}
              />
            ))}
          </div>
        ))}
      </SmoothCollapse>
    </div>
  );
}

function PairItem({
  entry,
  opts,
}: {
  entry: { f: string; entry: T.DictionaryEntry };
  opts: T.TextOptions;
}) {
  return (
    <div className="col-sm">
      <div className="mb-1">
        <InlinePs
          opts={opts}
          ps={{ ...entry.entry, f: entry.f, e: undefined }}
        />
      </div>
      <audio
        controls
        src={getAudio(entry.entry.ts, entry.entry.a)}
        preload="none"
      />
    </div>
  );
}

function getAudio(ts: number, a: number | undefined) {
  if (!a) {
    return undefined;
  }
  const tag = a === 1 ? "" : "f";
  return `https://storage.lingdocs.com/audio/${ts}${tag}.mp3`;
}
