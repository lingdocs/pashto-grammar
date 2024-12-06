import GameCore from "../GameCore";
import {
  humanReadableVerbForm,
  Types as T,
  InlinePs,
  grammarUnits,
  defaultTextOptions as opts,
} from "@lingdocs/ps-react";
import { makePool } from "../../lib/pool";
import { CSSProperties, useEffect, useState } from "react";
import classNames from "classnames";
import { isImperativeTense } from "@lingdocs/ps-react/dist/lib/src/type-predicates";

const amount = 12;
const timeLimit = 125;

type StemRoot =
  | "imperfective stem"
  | "perfective stem"
  | "imperfective root"
  | "perfective root";
type Ending = "present" | "past" | "imperative";
type Formula = {
  ba: boolean;
  mu: boolean;
  stemRoot: StemRoot;
  ending: Ending;
};

type Question = {
  tense: T.VerbTense | T.ImperativeTense | "negative imperative";
  formula: Formula;
};

const questions: Question[] = [
  {
    tense: "presentVerb",
    formula: {
      ba: false,
      mu: false,
      stemRoot: "imperfective stem",
      ending: "present",
    },
  },
  {
    tense: "subjunctiveVerb",
    formula: {
      ba: false,
      mu: false,
      stemRoot: "perfective stem",
      ending: "present",
    },
  },
  {
    tense: "imperfectiveFuture",
    formula: {
      ba: true,
      mu: false,
      stemRoot: "imperfective stem",
      ending: "present",
    },
  },
  {
    tense: "perfectiveFuture",
    formula: {
      ba: true,
      mu: false,
      stemRoot: "perfective stem",
      ending: "present",
    },
  },
  {
    tense: "imperfectivePast",
    formula: {
      ba: false,
      mu: false,
      stemRoot: "imperfective root",
      ending: "past",
    },
  },
  {
    tense: "perfectivePast",
    formula: {
      ba: false,
      mu: false,
      stemRoot: "perfective root",
      ending: "past",
    },
  },
  {
    tense: "habitualImperfectivePast",
    formula: {
      ba: true,
      mu: false,
      stemRoot: "imperfective root",
      ending: "past",
    },
  },
  {
    tense: "habitualPerfectivePast",
    formula: {
      ba: true,
      mu: false,
      stemRoot: "perfective root",
      ending: "past",
    },
  },
  {
    tense: "perfectiveImperative",
    formula: {
      ba: false,
      mu: false,
      stemRoot: "perfective stem",
      ending: "imperative",
    },
  },
  {
    tense: "imperfectiveImperative",
    formula: {
      ba: false,
      mu: false,
      stemRoot: "imperfective stem",
      ending: "imperative",
    },
  },
  {
    tense: "negative imperative",
    formula: {
      ba: false,
      mu: true,
      stemRoot: "imperfective stem",
      ending: "imperative",
    },
  },
];

export default function VerbFormulas({
  inChapter,
  id,
  link,
  level,
}: {
  inChapter: boolean;
  id: string;
  link: string;
  level: "all";
}) {
  const questionsPool = makePool(questions);
  function getQuestion() {
    return questionsPool();
  }
  function Instructions() {
    return <p className="lead">Pick the formula for each verb tense</p>;
  }
  return (
    <GameCore
      inChapter={inChapter}
      studyLink={link}
      getQuestion={getQuestion}
      id={id}
      Display={Display}
      DisplayCorrectAnswer={DisplayCorrectAnswer}
      timeLimit={timeLimit}
      amount={amount}
      Instructions={Instructions}
    />
  );
}

function Display({ question, callback }: QuestionDisplayProps<Question>) {
  const [ba, setBa] = useState<boolean>(false);
  const [mu, setMu] = useState<boolean>(false);
  const [stemRoot, setStemRoot] = useState<StemRoot | "">("");
  const [ending, setEnding] = useState<Ending | "">("");
  useEffect(() => {
    setBa(false);
    setStemRoot("");
    setEnding("");
    setMu(false);
  }, [question]);
  const canSubmit = !!(stemRoot && ending);
  const showMu =
    question.tense === "negative imperative" ||
    isImperativeTense(question.tense);
  function handleSubmit() {
    const { formula } = question;
    callback(
      ba === formula.ba &&
        mu === formula.mu &&
        stemRoot === formula.stemRoot &&
        ending === formula.ending
    );
  }
  return (
    <div>
      <div className="my-4" style={{ maxWidth: "300px", margin: "0 auto" }}>
        <p className="lead">{humanReadableT(question.tense)}</p>
      </div>
      <div className="text-center mb-2">
        <BaPicker value={ba} onChange={setBa} />
        {showMu && <MuPicker value={mu} onChange={setMu} />}
        <RootsAndStemsPicker value={stemRoot} onChange={setStemRoot} />
        <EndingPicker value={ending} onChange={setEnding} />
        <button
          className="btn btn-primary my-2"
          disabled={!canSubmit}
          onClick={canSubmit ? handleSubmit : undefined}
        >
          Submit
        </button>
      </div>
      <samp>{printFormula({ ba, stemRoot, ending, mu })}</samp>
    </div>
  );
}

function humanReadableT(
  tense: T.VerbTense | T.ImperativeTense | "negative imperative"
): string {
  if (tense === "negative imperative") {
    return tense;
  }
  return humanReadableVerbForm(tense);
}

function printFormula({
  mu,
  ba,
  stemRoot,
  ending,
}: {
  mu: boolean;
  ba: boolean;
  stemRoot: StemRoot | "";
  ending: Ending | "";
}): string {
  const elements = [
    mu ? "mu" : undefined,
    ba ? "ba" : undefined,
    stemRoot,
    ending ? `${ending} ending` : undefined,
  ].filter((x) => x) as string[];
  return elements.join(" + ");
}

function DisplayCorrectAnswer({
  question,
}: {
  question: Question;
}): JSX.Element {
  return (
    <div>
      <samp>{printFormula(question.formula)}</samp>
    </div>
  );
}

function EndingPicker({
  onChange,
  value,
}: {
  value: Ending | "";
  onChange: (e: Ending | "") => void;
}) {
  const options: { label: string; value: Ending }[] = [
    { label: "Present", value: "present" },
    { label: "Past", value: "past" },
    { label: "Imperative", value: "imperative" },
  ];
  function handleClick(e: Ending) {
    // onChange(ending === e ? "" : e);
    onChange(e);
  }
  return (
    <div className="my-3">
      <span className="mr-2">Ending:</span>
      <div className="btn-group">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={classNames("btn", "btn-outline-secondary", {
              active: value === option.value,
            })}
            onClick={() => handleClick(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function BaPicker({
  onChange,
  value,
}: {
  value: boolean;
  onChange: (b: boolean) => void;
}) {
  return (
    <div className="form-check my-3" style={{ fontSize: "larger" }}>
      <input
        id="baCheckbox"
        className="form-check-input"
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label className="form-check-label text-muted" htmlFor="baCheckbox">
        with <InlinePs opts={opts} ps={grammarUnits.baParticle} /> in the kids'
        section
      </label>
    </div>
  );
}

function MuPicker({
  onChange,
  value,
}: {
  value: boolean;
  onChange: (b: boolean) => void;
}) {
  return (
    <div className="form-check my-3" style={{ fontSize: "larger" }}>
      <input
        id="baCheckbox"
        className="form-check-input"
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label className="form-check-label text-muted" htmlFor="baCheckbox">
        with <InlinePs opts={opts} ps={{ p: "مه", f: "mú" }} />
      </label>
    </div>
  );
}

function RootsAndStemsPicker({
  onChange,
  value,
}: {
  value: StemRoot | "";
  onChange: (s: StemRoot | "") => void;
}) {
  const colClass = "col col-md-5 px-0 mb-1";
  const rowClass = "row justify-content-between";
  const title: CSSProperties = {
    fontWeight: "bolder",
    paddingBottom: "1.75rem",
    paddingTop: "1.75rem",
  };
  const highlight = {
    background: "rgba(255, 227, 10, 0.6)",
  };
  function handleStemRootClick(s: StemRoot) {
    onChange(value === s ? "" : s);
  }
  return (
    <div
      className="verb-info"
      style={{
        textAlign: "center",
        maxWidth: "400px",
        margin: "0 auto",
        // backgroundImage: `url(${fadedTree})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50% 45%",
        backgroundSize: "50%",
      }}
    >
      <div
        style={{
          border: "2px solid black",
          padding: "1rem",
          margin: "0.25rem",
        }}
        className="container"
      >
        <div className={rowClass + " align-items-center"}>
          <div className={colClass}>
            <i className="fas fa-video fa-lg" />
          </div>
          <div className={colClass}>
            <div className="d-flex flex-row justify-content-center align-items-center">
              <div>
                <i className="fas fa-camera fa-lg mx-3" />
              </div>
            </div>
          </div>
        </div>
        <div className={rowClass}>
          <div
            className={colClass}
            style={value === "imperfective stem" ? highlight : {}}
          >
            <div
              className="clickable"
              style={title}
              onClick={() => handleStemRootClick("imperfective stem")}
            >
              <div>Imperfective Stem</div>
            </div>
          </div>
          <div
            className={colClass}
            style={value === "perfective stem" ? highlight : {}}
          >
            <div
              className="clickable"
              style={title}
              onClick={() => handleStemRootClick("perfective stem")}
            >
              <div>Perfective Stem</div>
            </div>
          </div>
        </div>
        <div className={rowClass}>
          <div
            className={colClass}
            style={value === "imperfective root" ? highlight : {}}
          >
            <div
              className="clickable"
              style={title}
              onClick={() => handleStemRootClick("imperfective root")}
            >
              <div>Imperfective Root</div>
            </div>
          </div>
          <div
            className={colClass}
            style={value === "perfective root" ? highlight : {}}
          >
            <div>
              <div
                className="clickable"
                style={title}
                onClick={() => handleStemRootClick("perfective root")}
              >
                <div>Perfective Root</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
