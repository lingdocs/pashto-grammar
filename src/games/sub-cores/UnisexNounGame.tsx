import { useState } from "react";
import { comparePs } from "../../lib/game-utils";
import genderColors from "../../lib/gender-colors";
import GameCore from "../GameCore";
import {
  Types as T,
  Examples,
  defaultTextOptions as opts,
  inflectWord,
  firstVariation,
  typePredicates as tp,
  randFromArray,
} from "@lingdocs/ps-react";
import { nouns } from "../../words/words";
import { intoPatterns } from "../../lib/categorize";

const unisexNouns = nouns.filter(tp.isUnisexNounEntry);
type NType =
  | "pattern1"
  | "pattern2"
  | "pattern3"
  | "pattern4"
  | "pattern5"
  | "other";
// TODO: make pattern types as overlay types
const types = intoPatterns(unisexNouns);
const genders: T.Gender[] = ["masc", "fem"];

const amount = 14;

type Question = { entry: T.DictionaryEntry; gender: T.Gender };

export default function UnisexNounGame({
  id,
  link,
  inChapter,
}: {
  inChapter: boolean;
  id: string;
  link: string;
}) {
  let pool = { ...types };
  function getQuestion(): Question {
    const keys = Object.keys(types) as NType[];
    let type: NType;
    do {
      type = randFromArray(keys);
    } while (!pool[type].length);
    const entry = randFromArray<T.UnisexNounEntry>(
      // @ts-ignore
      pool[type]
    );
    const gender = randFromArray(genders) as T.Gender;
    // @ts-ignore
    pool[type] = pool[type].filter((x) => x.ts !== entry.ts);
    return {
      entry,
      gender,
    };
  }

  function Display({ question, callback }: QuestionDisplayProps<Question>) {
    const [answer, setAnswer] = useState<string>("");
    const infOut = inflectWord(question.entry);
    if (!infOut) return <div>WORD ERROR</div>;
    const { inflections } = infOut;
    if (!inflections) return <div>WORD ERROR</div>;
    const givenGender = question.gender === "masc" ? "masculine" : "feminine";
    const requiredGender = question.gender === "fem" ? "masculine" : "feminine";
    if (!("masc" in inflections) || !("fem" in inflections)) {
      return <div>WORD ERROR</div>;
    }
    if (!inflections.masc || !inflections.fem) {
      return <div>WORD ERROR</div>;
    }
    const handleInput = ({
      target: { value },
    }: React.ChangeEvent<HTMLInputElement>) => {
      setAnswer(value);
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // @ts-ignore
      const correctAnswer = inflections[flipGender(question.gender)][0];
      const correct = comparePs(answer, correctAnswer);
      if (correct) {
        setAnswer("");
      }
      callback(correct);
    };

    return (
      <div>
        <div
          className="pt-2 pb-1 mb-2"
          style={{
            maxWidth: "300px",
            margin: "0 auto",
            backgroundColor:
              genderColors[question.gender === "masc" ? "m" : "f"],
          }}
        >
          <Examples opts={opts}>
            {[
              {
                ...inflections[question.gender][0][0],
                e: firstVariation(question.entry.e),
              },
            ]}
          </Examples>
        </div>
        <div>
          Is {givenGender}. Make it{" "}
          <span
            style={{
              background:
                genderColors[requiredGender === "masculine" ? "m" : "f"],
            }}
          >
            {requiredGender}
          </span>
          .
        </div>
        <form onSubmit={handleSubmit}>
          <div className="my-3" style={{ maxWidth: "200px", margin: "0 auto" }}>
            <input
              type="text"
              className="form-control"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              dir="auto"
              value={answer}
              onChange={handleInput}
            />
            <div className="text-muted small mt-3">
              Type <kbd>Enter</kbd> to check
            </div>
          </div>
        </form>
      </div>
    );
  }

  function Instructions() {
    return (
      <div>
        <h5>Change the gender of a given noun</h5>
      </div>
    );
  }

  function DisplayCorrectAnswer({ question }: { question: Question }) {
    const infOut = inflectWord(question.entry);
    if (!infOut) return <div>WORD ERROR</div>;
    const { inflections } = infOut;
    // @ts-ignore
    const correctAnswer = inflections[flipGender(question.gender)][0];
    return (
      <div>
        {correctAnswer.length > 1 && (
          <div className="text-muted">One of the following:</div>
        )}
        {correctAnswer.map((ps: any) => (
          <Examples opts={opts}>{ps}</Examples>
        ))}
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
      amount={amount}
      timeLimit={175}
      Instructions={Instructions}
    />
  );
}

function flipGender(g: T.Gender): T.Gender {
  return g === "masc" ? "fem" : "masc";
}
