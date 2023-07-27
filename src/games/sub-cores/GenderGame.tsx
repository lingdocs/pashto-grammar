import genderColors from "../../lib/gender-colors";
import GameCore from "../GameCore";
import {
  Types as T,
  Examples,
  defaultTextOptions as opts,
  endsWith,
  pashtoConsonants,
  inflectWord,
  isUnisexSet,
  typePredicates as tp,
  firstVariation,
  randFromArray,
} from "@lingdocs/ps-react";
import { nouns } from "../../words/words";
import { categorize } from "../../lib/categorize";

const genders: T.Gender[] = ["masc", "fem"];

const mascNouns = nouns.filter(tp.isMascNounEntry);
const femNouns = [
  ...nouns.filter(tp.isFemNounEntry),
  ...getFemVersions(mascNouns.filter(tp.isUnisexNounEntry)),
];

const types = {
  masc: categorize<
    T.MascNounEntry,
    {
      consonantMasc: T.MascNounEntry[];
      eyMasc: T.MascNounEntry[];
      uMasc: T.MascNounEntry[];
      yMasc: T.MascNounEntry[];
    }
  >(mascNouns, {
    consonantMasc: endsWith([{ p: pashtoConsonants }, { p: "و", f: "w" }]),
    eyMasc: endsWith({ p: "ی", f: "ey" }),
    uMasc: endsWith({ p: "ه", f: "u" }),
    yMasc: endsWith([
      { p: "ای", f: "aay" },
      { p: "وی", f: "ooy" },
    ]),
  }),
  fem: categorize<
    T.FemNounEntry,
    {
      aaFem: T.FemNounEntry[];
      eeFem: T.FemNounEntry[];
      uyFem: T.FemNounEntry[];
      aFem: T.FemNounEntry[];
      eFem: T.FemNounEntry[];
    }
  >(femNouns, {
    aaFem: endsWith({ p: "ا", f: "aa" }),
    eeFem: endsWith({ p: "ي", f: "ee" }),
    uyFem: endsWith({ p: "ۍ" }),
    aFem: endsWith([
      { p: "ه", f: "a" },
      { p: "ح", f: "a" },
    ]),
    eFem: endsWith({ p: "ې" }),
  }),
};

function getFemVersions(uns: T.UnisexNounEntry[]): T.FemNounEntry[] {
  return uns
    .map((n) => {
      const infs = inflectWord(n);
      if (!infs || !infs.inflections) return undefined;
      if (!isUnisexSet(infs.inflections)) return undefined;
      return {
        e: n.e,
        ...infs.inflections.fem[0][0],
      } as T.DictionaryEntry;
    })
    .filter((n) => !!n) as T.FemNounEntry[];
}

function flatten<T>(o: Record<string, T[]>): T[] {
  return Object.values(o).flat();
}

function nounNotIn(
  st: T.NounEntry[]
): (n: T.NounEntry | T.DictionaryEntry) => boolean {
  return (n: T.DictionaryEntry) => !st.find((x) => x.ts === n.ts);
}

type CategorySet = Record<string, T.NounEntry[]>;
// for some reason we need to use this CategorySet type here... 🤷‍♂️
const exceptions: Record<string, CategorySet> = {
  masc: {
    exceptionMasc: mascNouns.filter(nounNotIn(flatten(types.masc))),
  },
  fem: {
    exceptionFem: femNouns.filter(nounNotIn(flatten(types.fem))),
  },
};

const amount = 25;
type Question = T.DictionaryEntry;

export default function GenderGame({
  level,
  id,
  link,
  inChapter,
}: {
  inChapter: boolean;
  level: 1 | 2;
  id: string;
  link: string;
}) {
  const wordPool = { ...types };
  const exceptionsPool = { ...exceptions };
  function getQuestion(): Question {
    const base =
      level === 1 ? wordPool : randFromArray([wordPool, exceptionsPool]);
    const gender = randFromArray(genders);
    let typeToUse: string;
    do {
      typeToUse = randFromArray(Object.keys(base[gender]));
      // @ts-ignore
    } while (!base[gender][typeToUse].length);
    // @ts-ignore
    const question = randFromArray(base[gender][typeToUse]);
    // @ts-ignore
    base[gender][typeToUse] = base[gender][typeToUse].filter(
      // @ts-ignore
      (entry) => entry.ts !== question.ts
    );
    // @ts-ignore
    return question;
  }
  function Display({ question, callback }: QuestionDisplayProps<Question>) {
    function check(gender: T.Gender) {
      const nounGender: T.Gender = nounNotIn(mascNouns)(question)
        ? "fem"
        : "masc";
      callback(gender === nounGender);
    }
    return (
      <div>
        <div className="mb-4" style={{ fontSize: "larger" }}>
          <Examples opts={opts}>
            {[
              {
                p: firstVariation(question.p),
                f: firstVariation(question.f),
                e: level === 2 ? firstVariation(question.e) : undefined,
              },
            ]}
          </Examples>
        </div>
        <div className="mt-4">
          <button
            style={{ background: genderColors.f, color: "black" }}
            className="btn btn-lg mr-3"
            onClick={() => check("fem")}
          >
            Feminine
          </button>
          <button
            style={{ background: genderColors.m, color: "black" }}
            className="btn btn-lg ml-3"
            onClick={() => check("masc")}
          >
            Masculine
          </button>
        </div>
      </div>
    );
  }

  function Instructions() {
    return (
      <div>
        <h5>Choose the right gender for each word</h5>
        {level === 2 && <div>⚠ Exceptions included...</div>}
      </div>
    );
  }

  function DisplayCorrectAnswer({ question }: { question: Question }) {
    const nounGender: T.Gender = nounNotIn(mascNouns)(question)
      ? "fem"
      : "masc";
    return (
      <div className="my-2 text-center">
        <button
          style={{
            background: genderColors[nounGender === "masc" ? "m" : "f"],
            color: "black",
          }}
          className="btn btn-lg"
          disabled
        >
          {nounGender === "masc" ? "Masculine" : "Feminine"}
        </button>
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
      timeLimit={level === 1 ? 70 : 80}
      Instructions={Instructions}
    />
  );
}
