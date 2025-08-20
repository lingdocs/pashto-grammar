import GameCore from "../GameCore";
import type { JSX } from "react";
import type { Types as T } from "@lingdocs/ps-react";
import {
  humanReadableEquativeTense,
} from "@lingdocs/ps-react";
import { makePool } from "../../lib/pool";

const tenses: T.EquativeTense[] = [
  "present", "habitual", "subjunctive", "future", "past", "wouldBe", "pastSubjunctive", "wouldHaveBeen"
];

type Situation = {
  description: string | JSX.Element,
  tense: T.EquativeTense[],
};

const amount = 12;
const timeLimit = 100;

const situations: Situation[] = [
  {
    description: "A is B, for sure, right now",
    tense: ["present"],
  },
  {
    description: "A is probably B, right now",
    tense: ["future"],
  },
  {
    description: "A will be B in the future",
    tense: ["future"],
  },
  {
    description: "We can assume that A is most likely B",
    tense: ["future"],
  },
  {
    description: "You know A is B, currently",
    tense: ["present"],
  },
  {
    description: "A tends to be B",
    tense: ["habitual"],
  },
  {
    description: "A is usually B",
    tense: ["habitual"],
  },
  {
    description: "A is generally B",
    tense: ["habitual"],
  },
  {
    description: "A is B, right now",
    tense: ["present"],
  },
  {
    description: "A is always B, as a matter of habit",
    tense: ["present"],
  },
  {
    description: "It's a good thing for A to be B",
    tense: ["subjunctive"],
  },
  {
    description: "A needs to be B (out of obligation/necessity)",
    tense: ["subjunctive"],
  },
  {
    description: "You hope that A is B",
    tense: ["subjunctive"],
  },
  {
    description: "You desire A to be B",
    tense: ["subjunctive"],
  },
  {
    description: "If A is B ...",
    tense: ["subjunctive"],
  },
  {
    description: "...so that A will be B (a purpose)",
    tense: ["subjunctive"],
  },
  {
    description: "A was definately B",
    tense: ["past"],
  },
  {
    description: "A was B",
    tense: ["past"],
  },
  {
    description: "A was probably B in the past",
    tense: ["wouldBe"],
  },
  {
    description: "A used to be B (habitually, repeatedly)",
    tense: ["wouldBe"],
  },
  {
    description: "assume that A would have probably been B",
    tense: ["wouldBe"],
  },
  {
    description: "under different circumstances, A would have been B",
    tense: ["wouldBe", "pastSubjunctive"],
  },
  {
    description: "You wish A were B (but it's not)",
    tense: ["pastSubjunctive"],
  },
  {
    description: "If A were B (but it's not)",
    tense: ["pastSubjunctive"],
  },
  {
    description: "Aaagh! If only A were B!",
    tense: ["pastSubjunctive"],
  },
  {
    description: "A should have been B!",
    tense: ["pastSubjunctive", "wouldBe"],
  },
];

type Question = Situation;


export default function EquativeSituations({ inChapter, id, link }: { inChapter: boolean, id: string, link: string, level: "situations" }) {
  const situationsPool = makePool(situations);
  function getQuestion(): Question {
    return situationsPool();
  };

  function Display({ question, callback }: QuestionDisplayProps<Question>) {

    function handleTenseClick(t: T.EquativeTense) {
      callback(question.tense.includes(t));
    }
    return <div>
      <div className="mb-2" style={{ maxWidth: "300px", margin: "0 auto" }}>
        <p className="lead">
          {question.description}
        </p>
      </div>
      <div className="text-center">
        <div className="row">
          {tenses.map(t => <div className="col" key={Math.random()}>
            <button
              style={{ width: "8rem" }}
              className="btn btn-outline-secondary mb-3"
              onClick={() => handleTenseClick(t)}
            >
              {humanReadableEquativeTense(t)}
            </button>
          </div>)}
        </div>
      </div>
    </div>
  }

  function Instructions() {
    return <p className="lead">Choose a type of equative that works for each given situation</p>;
  }

  return <GameCore
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
};

function DisplayCorrectAnswer({ question }: { question: Question }): JSX.Element {

  // callback(<div className="lead">
  //     {possibleCorrect.map(humanReadableTense).join(" or ")}
  // </div>)
  return <div>
    {question.tense.map(humanReadableEquativeTense).join(" or ")}
  </div>;
}

