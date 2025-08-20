import GameCore from "../GameCore";
import type { JSX } from "react";
import type { Types as T } from "@lingdocs/ps-react";
import {
  getInflectionPattern,
  Examples,
  defaultTextOptions as opts,
  firstVariation,
} from "@lingdocs/ps-react";
import { makePool } from "../../lib/pool";
import { nouns, adjectives } from "../../words/words";
import * as tp from "@lingdocs/ps-react/dist/lib/src/type-predicates";

const amount = 20;
const timeLimit = 150;

type Question = {
  entry: T.NounEntry | T.AdjectiveEntry;
  pattern: T.InflectionPattern;
};

const categories: { label: string; value: T.InflectionPattern }[] = [
  {
    label: "#1 Basic",
    value: 1, // T.InflectionPattern.Basic,
  },
  {
    label: "#2 Unstressed ی",
    value: 2, // T.InflectionPattern.UnstressedAy,
  },
  {
    label: "#3 Stressed ی",
    value: 3, // T.InflectionPattern.StressedAy,
  },
  {
    label: `#4 "Pashtoon"`,
    value: 4, // T.InflectionPattern.Pashtun,
  },
  {
    label: `#5 Short Squish`,
    value: 5, // T.InflectionPattern.Squish,
  },
  {
    label: "#6 Inan. Fem. ي",
    value: 6, // T.InflectionPattern.FemInanEe,
  },
  {
    label: "No Inflection",
    value: 0, // T.InflectionPattern.None,
  },
];

export default function InflectionPatterns({
  inChapter,
  id,
  link,
  level,
}: {
  inChapter: boolean;
  id: string;
  link: string;
  level: 1 | 2;
}) {
  const w = [...nouns, ...adjectives]
    .filter(
      level === 2
        ? (x) => x
        : (x) =>
          tp.isUnisexNounEntry(x) ||
          tp.isAdjectiveEntry(x) ||
          (tp.isFemNounEntry(x) && tp.isPattern6FemEntry(x))
    )
    .map((x) => ({ entry: x, pattern: getInflectionPattern(x) }));
  const words: Record<T.InflectionPattern, (T.NounEntry | T.AdjectiveEntry)[]> =
  {
    0: w.filter((x) => x.pattern === 0).map((x) => x.entry),
    1: w.filter((x) => x.pattern === 1).map((x) => x.entry),
    2: w.filter((x) => x.pattern === 2).map((x) => x.entry),
    3: w.filter((x) => x.pattern === 3).map((x) => x.entry),
    4: w.filter((x) => x.pattern === 4).map((x) => x.entry),
    5: w.filter((x) => x.pattern === 5).map((x) => x.entry),
    6: w.filter((x) => x.pattern === 6).map((x) => x.entry),
  };
  const pools: Record<
    T.InflectionPattern,
    () => T.NounEntry | T.AdjectiveEntry
  > = {
    0: makePool(words[0]),
    1: makePool(words[1]),
    2: makePool(words[2]),
    3: makePool(words[3]),
    4: makePool(words[4]),
    5: makePool(words[5]),
    6: makePool(words[6]),
  };
  const patternPool = makePool([
    0, 1, 2, 3, 4, 5, 6,
    // T.InflectionPattern.None,
    // T.InflectionPattern.Basic,
    // T.InflectionPattern.UnstressedAy,
    // T.InflectionPattern.StressedAy,
    // T.InflectionPattern.Pashtun,
    // T.InflectionPattern.Squish,
    // T.InflectionPattern.FemInanEe,
  ]);
  function getQuestion(): Question {
    const pattern = patternPool();
    // @ts-ignore
    const entry = pools[pattern]();
    if (getInflectionPattern(entry) !== pattern) {
      throw Error("wrong pattern on word");
    }
    return { entry, pattern };
  }

  function Display({ question, callback }: QuestionDisplayProps<Question>) {
    function handleChoice(ic: T.InflectionPattern) {
      return callback(ic === question.pattern);
    }
    return (
      <div>
        <div className="mb-2" style={{ maxWidth: "300px", margin: "0 auto" }}>
          <Examples opts={opts}>
            {[
              {
                p: firstVariation(question.entry.p),
                f: firstVariation(question.entry.f),
                e: `${firstVariation(question.entry.e)} - ${question.entry.c}`,
              },
            ]}
          </Examples>
        </div>
        <div className="text-center">
          <div className="row">
            {categories.map((c) => (
              <div className="col" key={Math.random()}>
                <button
                  style={{ width: "8rem", height: "4rem" }}
                  className="btn btn-outline-secondary mb-3"
                  onClick={() => handleChoice(c.value)}
                >
                  {c.label}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function Instructions() {
    return (
      <div>
        <p className="lead">
          Choose the inflection pattern that each noun/adjective follows
        </p>
      </div>
    );
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

function DisplayCorrectAnswer({
  question,
}: {
  question: Question;
}): JSX.Element {
  // callback(<div className="lead">
  //     {possibleCorrect.map(humanReadableTense).join(" or ")}
  // </div>)
  return (
    <div>
      <p className="lead">
        {categories.find((c) => c.value === question.pattern)?.label}
      </p>
    </div>
  );
}
