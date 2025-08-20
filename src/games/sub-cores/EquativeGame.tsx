import { useEffect, useState } from "react";
import type { JSX } from "react";
import { comparePs } from "../../lib/game-utils";
import GameCore from "../GameCore";
import type { Types as T } from "@lingdocs/ps-react";
import {
  Examples,
  defaultTextOptions as opts,
  renderEP,
  compileEP,
  flattenLengths,
  InlinePs,
  grammarUnits,
} from "@lingdocs/ps-react";
import { randomEPSPool } from "./makeRandomEPS";

const kidsColor = "#017BFE";

const amount = 12;
const timeLimit = 100;

type Question = {
  EPS: T.EPSelectionComplete;
  phrase: { ps: T.PsString[]; e?: string[] };
  equative: T.EquativeRendered;
};

export default function EquativeGame({
  inChapter,
  id,
  link,
  level,
}: {
  inChapter: boolean;
  id: string;
  link: string;
  level: T.EquativeTense | "allTenses";
}) {
  const epsPool = randomEPSPool(level);
  function getQuestion(): Question {
    const EPS = epsPool();
    const EP = renderEP(EPS);
    const compiled = compileEP(EP, true, { equative: true, kidsSection: true });
    const phrase = {
      ps: compiled.ps,
      e: compiled.e,
    };
    return {
      EPS,
      phrase,
      equative: getEqFromRendered(EP),
    };
  }

  function Display({ question, callback }: QuestionDisplayProps<Question>) {
    const [answer, setAnswer] = useState<string>("");
    const [withBa, setWithBa] = useState<boolean>(false);
    const handleInput = ({
      target: { value },
    }: React.ChangeEvent<HTMLInputElement>) => {
      setAnswer(value);
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const correct =
        comparePs(answer, question.equative.ps) &&
        withBa === question.equative.hasBa;
      if (correct) {
        setAnswer("");
      }
      callback(correct);
    };
    useEffect(() => {
      if (level === "allTenses") setWithBa(false);
    }, [question]);

    return (
      <div>
        <div className="mb-2" style={{ maxWidth: "300px", margin: "0 auto" }}>
          <Examples lineHeight={1} opts={opts}>
            {/* @ts-ignore  TODO: REMOVE AS P_INFLE */}
            {modExs(question.phrase.ps, withBa)[0]}
          </Examples>
          {question.phrase.e &&
            question.phrase.e.map((e, i) => (
              <div key={e + i} className="text-muted">
                {e}
              </div>
            ))}
          <div>{humanReadableTense(question.EPS.equative.tense)} equative</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-check mt-1">
            <input
              id="baCheckbox"
              className="form-check-input"
              type="checkbox"
              checked={withBa}
              onChange={(e) => setWithBa(e.target.checked)}
            />
            <label className="form-check-label text-muted" htmlFor="baCheckbox">
              with <InlinePs opts={opts} ps={grammarUnits.baParticle} /> in the{" "}
              <span style={{ color: kidsColor }}>kids' section</span>
            </label>
          </div>
          <div className="my-1" style={{ maxWidth: "200px", margin: "0 auto" }}>
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
          </div>
          <div className="text-center my-2">
            {/* <div> */}
            <button className="btn btn-primary" type="submit">
              submit ↵
            </button>
            {/* </div> */}
            {/* <div className="text-muted small text-center mt-2">
                        Type <kbd>Enter</kbd> to check
                    </div> */}
          </div>
        </form>
      </div>
    );
  }

  function Instructions() {
    return (
      <div>
        <p className="lead">
          Fill in the blank with the correct{" "}
          {level === "allTenses" ? "" : humanReadableTense(level)} equative
        </p>
        {level === "allTenses" && <div>⚠ All tenses included...</div>}
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
      timeLimit={level === "allTenses" ? timeLimit * 1.3 : timeLimit}
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
  return (
    <div>
      <div>
        {flattenLengths(question.equative.ps).reduce(
          (accum, curr, i): JSX.Element[] => [
            ...accum,
            ...(i > 0 ? [<span className="text-muted"> or </span>] : []),
            <span key={i}>{curr.p}</span>,
          ],
          [] as JSX.Element[]
        )}
      </div>
      <div>
        <strong>{question.equative.hasBa ? "with" : "without"}</strong> a{" "}
        <InlinePs opts={opts} ps={grammarUnits.baParticle} /> in the kids'
        section.
      </div>
    </div>
  );
}
function modExs(
  exs: T.PsString[],
  withBa: boolean
): { p: JSX.Element; f: JSX.Element }[] {
  return exs.map((ps) => {
    if (!ps.p.includes(" ___ ")) {
      return {
        p: <>{ps.p}</>,
        f: <>{ps.f}</>,
      };
    }
    const splitP = ps.p.split(" ___ ");
    const splitF = ps.f.split(" ___ ");
    return {
      p: (
        <>
          {splitP[0]}{" "}
          <span style={{ color: kidsColor }}>{withBa ? "به" : "__"}</span>{" "}
          {splitP[1]}
        </>
      ),
      f: (
        <>
          {splitF[0]}{" "}
          <span style={{ color: kidsColor }}>{withBa ? "ba" : "__"}</span>{" "}
          {splitF[1]}
        </>
      ),
    };
  });
}

function humanReadableTense(tense: T.EquativeTense | "allProduce"): string {
  return tense === "allProduce"
    ? ""
    : tense === "pastSubjunctive"
      ? "past subjunctive"
      : tense === "wouldBe"
        ? `"would be"`
        : tense === "wouldHaveBeen"
          ? `"would have been"`
          : tense;
}

function getEqFromRendered(e: T.EPRendered): T.EquativeRendered {
  const eblock = e.blocks[0].find((x) => x.block.type === "equative");
  if (!eblock || eblock.block.type !== "equative")
    throw new Error("Error getting equative block");
  return eblock.block.equative;
}
