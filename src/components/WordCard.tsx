import type { Types as T } from "@lingdocs/ps-react";
import {
  Examples,
  defaultTextOptions as opts,
  firstVariation,
  removeFVarients,
  getInflectionPattern,
  HumanReadableInflectionPattern,
} from "@lingdocs/ps-react";

function WordCard({ showHint, entry, selection }: {
  showHint: boolean
} & ({
  entry: T.AdjectiveEntry,
  selection: undefined,
} | {
  entry: T.NounEntry,
  selection: T.NounSelection,
})) {
  const e = removeFVarients(entry);
  return <div className="card" style={{ minWidth: "10rem", maxWidth: "15rem" }}>
    <div className="card-body" style={{ padding: "0.25rem" }}>
      <Examples opts={opts}>{[
        {
          p: e.p,
          f: e.f,
          e: `${firstVariation(e.e)} - ${e.c}`,
        }
      ]}</Examples>
      {selection && <div style={{ marginTop: "-0.75rem" }}>
        {selection.genderCanChange && selection.gender === "fem"
          && <span style={{ margin: "0 0.2rem" }}><strong>feminine</strong></span>}
        {selection.numberCanChange && selection.number === "plural"
          && <span style={{ marginLeft: "0 0.2rem" }}><strong>plural</strong></span>}
      </div>}
      {showHint && <EntryCategoryTip entry={entry} />}
    </div>
  </div>;
}

function EntryCategoryTip({ entry }: { entry: T.AdjectiveEntry | T.NounEntry }) {
  const pattern = getInflectionPattern(entry);
  return <div className="badge bg-light small">
    {HumanReadableInflectionPattern(pattern, opts)}
  </div>;
}

export default WordCard;
