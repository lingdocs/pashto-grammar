import GameCore from "../GameCore";
import type { JSX } from "react";
import type { Types as T } from "@lingdocs/ps-react";
import {
  getInflectionPattern,
  Examples,
  defaultTextOptions as opts,
  firstVariation,
  inflectWord,
  HumanReadableInflectionPattern,
  isUnisexSet,
  InflectionsTable,
} from "@lingdocs/ps-react";
import { makePool } from "../../lib/pool";
import { nouns, adjectives } from "../../words/words";
import { isAdverbEntry } from "@lingdocs/ps-react/dist/lib/src/type-predicates";
import { useEffect, useRef, useState } from "react";
import type {
  ChangeEvent,
  FormEvent,
} from "react";
import { comparePs } from "../../lib/game-utils";

const amount = 8;
const timeLimit = 300;

type Question = {
  entry: T.NounEntry | T.AdjectiveEntry;
  inflections: T.Inflections;
};

type InfFormContent = {
  masc: [string, string, string];
  fem: [string, string, string];
};

export default function InflectionsWriting({
  inChapter,
  id,
  link,
  level,
}: {
  inChapter: boolean;
  id: string;
  link: string;
  level: T.InflectionPattern;
}) {
  const wordPool = makePool(
    [...nouns, ...adjectives].filter((x) => {
      if (isAdverbEntry(x)) return false;
      const infs = inflectWord(x);
      if (!infs || !infs.inflections) return false;
      return getInflectionPattern(x) === level;
    })
  );

  function getQuestion(): Question {
    const word = wordPool();
    const r = inflectWord(word);
    if (!r || !r.inflections) {
      throw new Error(`error getting inflections for ${word.f}`);
    }
    return {
      entry: word,
      inflections: r.inflections,
    };
  }

  function Display({ question, callback }: QuestionDisplayProps<Question>) {
    function handleAnswer(inf: InfFormContent) {
      callback(infAnswerCorrect(inf, question.inflections));
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
        <InflectionTableForm
          onSubmit={handleAnswer}
          question={question}
          genders={
            isUnisexSet(question.inflections)
              ? "unisex"
              : "masc" in question.inflections
                ? "masc"
                : "fem"
          }
        />
      </div>
    );
  }

  function Instructions() {
    return (
      <div>
        <p className="lead">
          Complete the inflections for the{" "}
          <strong>{HumanReadableInflectionPattern(level, opts)}</strong> pattern
          word
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

function InflectionTableForm({
  onSubmit,
  genders,
  question,
}: {
  onSubmit: (i: InfFormContent) => void;
  genders: T.Gender | "unisex";
  question: Question;
}) {
  const [inf, setInf] = useState<InfFormContent>({
    fem: ["", "", ""],
    masc: ["", "", ""],
  });
  const mascInputRef = useRef<HTMLInputElement>(null);
  const femInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setInf({ fem: ["", "", ""], masc: ["", "", ""] });
    femInputRef.current && femInputRef.current.focus();
    mascInputRef.current && mascInputRef.current.focus();
  }, [question, setInf]);

  function handleClearInf() {
    setInf({ fem: ["", "", ""], masc: ["", "", ""] });
  }
  function handleInfInput(gender: T.Gender, inflection: number) {
    return ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      inf[gender][inflection] = value;
      setInf({ ...inf });
    };
  }
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(inf);
  }
  return (
    <form onSubmit={handleSubmit}>
      <table className="table" style={{ tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th scope="col" style={{ width: "3.5rem" }}></th>
            {genders !== "fem" && (
              <th scope="col" style={{ maxWidth: "10rem", textAlign: "left" }}>
                Masculine
              </th>
            )}
            {genders !== "masc" && (
              <th scope="col" style={{ maxWidth: "10rem", textAlign: "left" }}>
                Feminine
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {["Plain", "1st", "2nd"].map((title, i) => (
            <tr key={title}>
              <th scope="row">{title}</th>
              {genders !== "fem" && (
                <td>
                  <input
                    ref={i === 0 ? mascInputRef : undefined}
                    type="text"
                    className="form-control"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    dir="auto"
                    value={inf.masc[i]}
                    onChange={handleInfInput("masc", i)}
                    style={{ maxWidth: "12rem" }}
                  />
                </td>
              )}
              {genders !== "masc" && (
                <td>
                  <input
                    ref={i === 0 ? femInputRef : undefined}
                    type="text"
                    className="form-control"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    dir="auto"
                    value={inf.fem[i]}
                    onChange={handleInfInput("fem", i)}
                    style={{ maxWidth: "12rem" }}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-center">
        <button
          type="button"
          className="btn btn-secondary mx-3"
          onClick={handleClearInf}
        >
          Clear
        </button>
        <button type="submit" className="btn btn-primary mx-3">
          Submit
        </button>
      </div>
    </form>
  );
}

function DisplayCorrectAnswer({
  question,
}: {
  question: Question;
}): JSX.Element {
  return (
    <div>
      <InflectionsTable
        inf={question.inflections}
        textOptions={opts}
        hideTitle
      />
    </div>
  );
}

function infAnswerCorrect(answer: InfFormContent, inf: T.Inflections): boolean {
  function genInfCorrect(gender: T.Gender): boolean {
    // @ts-ignore
    const genInf = inf[gender] as T.InflectionSet;
    return genInf.every((x, i) =>
      x.some((ps) => comparePs(answer[gender][i], [ps]))
    );
  }
  if (isUnisexSet(inf)) {
    return genInfCorrect("masc") && genInfCorrect("fem");
  }
  return genInfCorrect("masc" in inf ? "masc" : "fem");
}
