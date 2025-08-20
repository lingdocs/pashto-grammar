import { useState } from "react";
import type { JSX } from "react";
import { comparePs } from "../../lib/game-utils";
import GameCore from "../GameCore";
import type { Types as T } from "@lingdocs/ps-react";
import {
  defaultTextOptions as opts,
  makeNounSelection,
  randFromArray,
  randomPerson,
  InlinePs,
  grammarUnits,
  renderVP,
  makeVPSelectionState,
  compileVP,
  isInvalidSubjObjCombo,
} from "@lingdocs/ps-react";
import { isPastTense, isThirdPerson } from "@lingdocs/ps-react";
import { maybeShuffleArray } from "../../lib/shuffle-array";
import { intransitivePastVerbs } from "../../content/verbs/basic-present-verbs";
import { makePool } from "../../lib/pool";
import { wordQuery } from "../../words/words";
import { isImperativeTense } from "@lingdocs/ps-react/dist/lib/src/type-predicates";
import { getVerbPs, verbHasBa, QuestionDisplay } from "./VerbGame";

const kidsColor = "#017BFE";

const amount = 12;
const timeLimit = 160;

type Question = {
  tense: T.VerbFormName;
  verb: T.VerbEntry;
  negative: boolean;
  rendered: T.VPRendered;
  phrase: { ps: T.SingleOrLengthOpts<T.PsString[]>; e?: string[] };
};

const transitivePastVerbs = wordQuery("verbs", [
  "leedul",
  "wahul",
  "khoRul",
  "shărmawul",
  "pejzandul",
  "taRul",
]);

const verbs = wordQuery("verbs", [
  "leekul",
  "wahul",
  "leedul",
  "awredul",
  "khoRul",
  "akhistul",
  "katul",
  "lwedul",
]);

const nouns = wordQuery("nouns", [
  "saRay",
  "xudza",
  "maashoom",
  "puxtoon",
  "Ustaaz",
  "DaakTar",
  "halik",
]);

const persons: T.Person[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

type PerfectGameLevel = {
  /* 1 is just a single verb, 2 picks a random verb for every question */
  level: 1 | 2;
  type: "intransitive" | "transitive-intransitive" | "all-tenses";
};
type VerbPoolName =
  | "basic"
  | "transitivePast"
  | "intransitivePast"
  | "mixedPast"
  | "mixedAll";

type LevelInfo = {
  description: string | JSX.Element;
  tense: T.PerfectTense | "allTenses";
  pool: VerbPoolName;
};

const levelInfos: Record<PerfectGameLevel["type"], LevelInfo> = {
  intransitive: {
    description: "present perfect form of the verb",
    tense: "presentPerfect",
    pool: "intransitivePast",
  },
  "transitive-intransitive": {
    description: "present perfect form of the verb",
    tense: "presentPerfect",
    pool: "mixedPast",
  },
  "all-tenses": {
    description: "correct perfect form of the verb",
    tense: "allTenses",
    pool: "mixedPast",
  },
};

// TODO: Level where you create the formulas (seperate file)
// level where you choose the right situation

const VerbGame: GameSubCore<PerfectGameLevel> = ({
  id,
  link,
  level,
  inChapter,
}: {
  inChapter: boolean;
  id: string;
  link: string;
  level: PerfectGameLevel;
}) => {
  const levelInfo = levelInfos[level.type];
  const personPool = makePool(persons);
  const verbPools: Record<VerbPoolName, () => T.VerbEntry> = {
    basic: makePool(verbs, 15),
    transitivePast: makePool(transitivePastVerbs, 15),
    intransitivePast: makePool(intransitivePastVerbs, 15),
    mixedPast: makePool([...transitivePastVerbs, ...intransitivePastVerbs], 15),
    mixedAll: makePool(
      [...verbs, ...transitivePastVerbs, ...intransitivePastVerbs],
      15
    ),
  };
  const tensePool = makePool<T.PerfectTense>([
    "presentPerfect",
    "pastPerfect",
    "subjunctivePerfect",
    "habitualPerfect",
    "pastPerfect",
    "futurePerfect",
    "wouldBePerfect",
    "pastSubjunctivePerfect",
    "wouldHaveBeenPerfect",
  ]);
  const oneVerb: T.VerbEntry = verbPools[levelInfo.pool]();
  const getVerb =
    level.level === 1 ? () => oneVerb : () => verbPools[levelInfo.pool]();
  function makeRandomNoun(): T.NounSelection {
    const n = makeNounSelection(randFromArray(nouns), undefined);
    return {
      ...n,
      gender: n.genderCanChange ? randFromArray(["masc", "fem"]) : n.gender,
      number: n.numberCanChange
        ? randFromArray(["singular", "plural"])
        : n.number,
    };
  }
  function makeRandomVPS(tense: T.PerfectTense): T.VPSelectionComplete {
    function personToNPSelection(p: T.Person): T.NPSelection {
      if (isThirdPerson(p)) {
        return {
          type: "NP",
          selection: randFromArray([
            () => makePronounS(p),
            makeRandomNoun,
            () => makePronounS(p),
          ])(),
        };
      }
      return {
        type: "NP",
        selection: makePronounS(p),
      };
    }
    function makePronounS(p: T.Person): T.PronounSelection {
      return {
        type: "pronoun",
        person: p,
        distance: randFromArray(["far", "near", "far"]),
      };
    }
    const verb = getVerb();
    const king = personPool();
    let servant: T.Person;
    do {
      servant = randomPerson();
    } while (isInvalidSubjObjCombo(king, servant));
    return makeVPS({
      verb,
      king: personToNPSelection(king),
      servant: personToNPSelection(servant),
      tense,
      defaultTransitivity: level.type.startsWith("transitive")
        ? "transitive"
        : "grammatically transitive",
    });
  }
  function getQuestion(): Question {
    const VPS = makeRandomVPS(
      levelInfo.tense === "allTenses" ? tensePool() : levelInfo.tense
    );
    const VP = renderVP(VPS);
    const compiled = compileVP(
      VP,
      { removeKing: false, shrinkServant: false },
      true,
      { ba: levelInfo.tense === "allTenses", verb: true, negative: true }
    );
    const phrase = {
      ps: compiled.ps,
      e: compiled.e,
    };
    return {
      negative: VPS.verb.negative,
      verb: VPS.verb.verb,
      tense: VPS.verb.tense,
      rendered: VP,
      phrase,
    };
  }

  function Display({ question, callback }: QuestionDisplayProps<Question>) {
    const [answer, setAnswer] = useState<string>("");
    const [withBa, setWithBa] = useState<boolean>(false);
    const handleInput = ({
      target: { value },
    }: React.ChangeEvent<HTMLInputElement>) => {
      if (value === "به " || value === "به ") {
        setWithBa(true);
        setAnswer("");
        return;
      }
      setAnswer(value);
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const correct =
        comparePs(answer, getVerbPs(question.rendered)) &&
        withBa === verbHasBa(question.rendered);
      if (correct) {
        setAnswer("");
      }
      callback(correct);
    };
    // useEffect(() => {
    //     if (level === "allProduce") setWithBa(false);
    // }, [question]);
    return (
      <div>
        <QuestionDisplay
          question={question}
          userAnswer={{
            withBa,
            answer,
          }}
        />
        <form onSubmit={handleSubmit}>
          {level.type === "all-tenses" && (
            <div className="form-check mt-1">
              <input
                id="baCheckbox"
                className="form-check-input"
                type="checkbox"
                checked={withBa}
                onChange={(e) => setWithBa(e.target.checked)}
              />
              <label
                className="form-check-label text-muted"
                htmlFor="baCheckbox"
              >
                with <InlinePs opts={opts} ps={grammarUnits.baParticle} /> in
                the <span style={{ color: kidsColor }}>kids' section</span>
              </label>
            </div>
          )}
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
    const desc = levelInfo.description;
    return (
      <div>
        <p className="lead">
          Write the {desc} verb to complete the phrase
          {desc ? "" : " (all tenses)"}
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
};

export default VerbGame;

function DisplayCorrectAnswer({
  question,
}: {
  question: Question;
}): JSX.Element {
  return (
    <div>
      <div>
        {getVerbPs(question.rendered).reduce(
          (accum, curr, i): JSX.Element[] => [
            ...accum,
            ...(i > 0 ? [<span className="text-muted"> or </span>] : []),
            <span key={i}>
              {curr.p} - {curr.f}
            </span>,
          ],
          [] as JSX.Element[]
        )}
      </div>
      <div>
        <strong>{verbHasBa(question.rendered) ? "with" : "without"}</strong> a{" "}
        <InlinePs opts={opts} ps={grammarUnits.baParticle} /> in the kids'
        section.
      </div>
    </div>
  );
}
// function modExs(exs: T.PsString[], withBa: boolean): { p: JSX.Element, f: JSX.Element }[] {
//     return exs.map(ps => {
//         if (!ps.p.includes(" ___ ")) {
//             return {
//                 p: <>{ps.p}</>,
//                 f: <>{ps.f}</>,
//             };
//         }
//         const splitP = ps.p.split(" ___ ");
//         const splitF = ps.f.split(" ___ ");
//         return {
//             p: <>{splitP[0]} <span style={{ color: kidsColor }}>{withBa ? "به" : "__"}</span> {splitP[1]}</>,
//             f: <>{splitF[0]} <span style={{ color: kidsColor }}>{withBa ? "ba" : "__"}</span> {splitF[1]}</>,
//         };
//     });
// }

// function addUserAnswer(
//   a: { withBa: boolean; answer: string },
//   ps: T.PsString
// ): T.PsString {
//   function addBa(x: T.PsString) {
//     if (!a.withBa) return x;
//     return {
//       p: x.p.replace(kidsBlank.p, baParticle.p),
//       f: x.f.replace(kidsBlank.f, baParticle.f),
//     };
//   }
//   function addAnswer(x: T.PsString): T.PsString {
//     if (!a.answer) return x;
//     const field = isPashtoScript(a.answer) ? "p" : "f";
//     return {
//       ...x,
//       [field]: x[field].replace(blank[field], a.answer),
//     };
//   }
//   return addAnswer(addBa(ps));
// }

function makeVPS({
  verb,
  king,
  servant,
  tense,
  defaultTransitivity,
}: {
  verb: T.VerbEntry;
  king: T.NPSelection;
  servant: T.NPSelection;
  tense: T.PerfectTense;
  defaultTransitivity: "transitive" | "grammatically transitive";
}): T.VPSelectionComplete {
  const vps = makeVPSelectionState(verb);
  const transitivity =
    vps.verb.transitivity === "transitive" && vps.verb.canChangeTransitivity
      ? defaultTransitivity
      : vps.verb.transitivity;
  const ergative =
    vps.verb.transitivity !== "intransitive" && isPastTense(tense);
  const subject = ergative ? servant : king;
  const object = ergative ? king : servant;
  return {
    ...vps,
    verb: {
      ...vps.verb,
      negative: isImperativeTense(tense)
        ? randFromArray([false, false, true])
        : false,
      transitivity,
      tense,
    },
    blocks: maybeShuffleArray([
      {
        key: Math.random(),
        block: {
          type: "subjectSelection",
          selection: subject,
        },
      },
      {
        key: Math.random(),
        block: {
          type: "objectSelection",
          selection:
            transitivity === "intransitive"
              ? "none"
              : transitivity === "grammatically transitive"
                ? 10
                : object,
        },
      },
    ]),
  };
}
