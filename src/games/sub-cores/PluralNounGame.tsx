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
  removeFVarients,
  psStringFromEntry,
} from "@lingdocs/ps-react";

import { wordQuery } from "../../words/words";
import { makePool } from "../../lib/pool";

export const nouns = wordQuery("nouns", [
  "dUaa",
  "idaa",
  "raNaa",
  "angrez",
  "xudza",
  "ihtiyaaj",
  "safar",
  "khob",
  "gUl",
  "wakht",
  "watan",
  "qaazee",
  "bachay",
  "spay",
  "nmasay",
  "atal",
  "puxtoon",
  "wayaand",
  "dzaay",
  "kitaab",
  "peesho",
  "ghul",
  "shpoon",
  "xUwoonkay",
  "gaawanDay",
  "sakhtee",
  "dostee",
  "aRtiyaa",
  "DaakTar",
  "laas",
  "waadu",
  "dost",
  "maar",
  "lewu",
  "چرګ",
  "zmaray",
  "zalmay",
  "paakistaanay",
  "baaNoo",
  "maamaa",
  "kaakaa",
  "qaazuy",
  "نرس",
  "ghwaa",
  "gwaax",
  "gaam",
  "andzoor",
  "ghlaa",
  "mlaa",
  "khabura",
  "andexna",
  "برقه",
  "پښه",
  "پوښتنه",
  "تمه",
  "shpa",
  "kurxa",
  "amsaa",
  "tsaa",
  "مېلمستیا",
  "وینا",
  "plaan",
  "bayragh",
  "ghaax",
  "فلم",
  "marg",
  "kaal",
  "noom",
  "paachaa",
  "laalaa",
  "بوټی",
  "پېټی",
  "توری",
  "غړی",
  "کاڼی",
  "کلی",
  "مړی",
  "چېلی",
  "کوچی",
  "eeraanay",
  "lmasay",
  "baazoo",
  "chaaqoo",
  "paaroo",
  "weeDiyo",
]);

// type NType =
//   | "pattern1"
//   | "pattern2"
//   | "pattern3"
//   | "pattern4"
//   | "pattern5"
//   | "other";
// // TODO: make pattern types as overlay types
// const types = intoPatterns(nouns);
const genders: T.Gender[] = ["masc", "fem"];

const amount = 25;

type Question = {
  entry: T.DictionaryEntry;
  singular: T.PsString;
  plural: T.PsString[];
  gender: T.Gender;
};

export default function PluralNounGame({
  id,
  link,
  inChapter,
}: {
  inChapter: boolean;
  id: string;
  link: string;
}) {
  const getFromNounPool = makePool(nouns);
  // let pool = { ...types };
  function getQuestion(): Question {
    const entry = getFromNounPool();
    const gender: T.Gender = tp.isUnisexNounEntry(entry)
      ? randFromArray(genders)
      : tp.isFemNounEntry(entry)
      ? "fem"
      : "masc";
    const [singular, plural] = getSingAndPlural({ entry, gender });
    if (!singular || plural.length === 0) {
      console.log({ singular, plural });
      throw new Error("unable to generate plurals for " + entry.p);
    }
    return {
      entry,
      gender,
      singular,
      plural,
    };
  }

  function getSingAndPlural({
    entry,
    gender,
  }: {
    entry: T.DictionaryEntry;
    gender: T.Gender;
  }): [T.PsString, T.PsString[]] {
    const infs = inflectWord(entry);
    if (!infs) {
      throw new Error("Unable to inflect word for plural");
    }
    const inflections: T.InflectionSet =
      infs.inflections && gender in infs.inflections
        ? // @ts-ignore
          infs.inflections[gender]
        : undefined;
    const plural: T.PluralInflectionSet =
      // @ts-ignore
      "plural" in infs && infs.plural ? infs.plural[gender] : undefined;
    const singular = inflections
      ? inflections[0][0]
      : psStringFromEntry(removeFVarients(entry));
    const allPlurals = [
      ...(inflections ? inflections[1] : []),
      ...(plural ? plural[0] : []),
    ];
    return [singular, allPlurals];
  }

  function Display({ question, callback }: QuestionDisplayProps<Question>) {
    const [answer, setAnswer] = useState<string>("");
    const handleInput = ({
      target: { value },
    }: React.ChangeEvent<HTMLInputElement>) => {
      setAnswer(value);
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const a = answer.replace(" ګ", "ګ").replace(" گ", "گ");
      const correct = comparePs(a, question.plural);
      if (correct) {
        setAnswer("");
      }
      callback(correct);
    };
    function makePartOfSpeechInfo(q: Question) {
      return `(n. ${q.gender === "masc" ? "m" : "f"}. ${
        q.entry.c?.includes("anim.") ? "anim." : ""
      })`;
    }

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
                ...question.singular,
                e: `${firstVariation(question.entry.e)} ${makePartOfSpeechInfo(
                  question
                )}`,
              },
            ]}
          </Examples>
        </div>
        <div>is a singular noun. Make it plural.</div>
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
        <h5>Make the given noun plural</h5>
      </div>
    );
  }

  function DisplayCorrectAnswer({ question }: { question: Question }) {
    return (
      <div>
        {question.plural.length > 1 && (
          <div className="text-muted">One of the following:</div>
        )}
        {question.plural.map((ps: any) => (
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
