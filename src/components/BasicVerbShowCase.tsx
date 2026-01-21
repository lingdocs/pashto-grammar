import type { Types as T } from "@lingdocs/pashto-inflector";
import {
  RootsAndStems,
  conjugateVerb,
  VerbTable,
  renderVP,
  compileVP,
  ButtonSelect,
  getEnglishVerb,
  InlinePs,
  removeFVarients,
  isPastTense,
  getPassiveRootsAndStems,
  getAbilityRootsAndStems,
  getLength,
  typePredicates,
} from "@lingdocs/pashto-inflector";
import { useState } from "react";
import Carousel from "./Carousel";
import {
  basicVerbs,
  intransitivePastVerbs,
} from "../content/verbs/basic-present-verbs";
import { isThirdPerson } from "@lingdocs/pashto-inflector";

function BasicVerbShowCase({
  opts,
  tense,
  passive,
  ability,
}: {
  opts: T.TextOptions;
  tense: T.VerbTense | T.ImperativeTense;
  passive?: boolean;
  ability?: boolean;
}) {
  const items = isPastTense(tense)
    ? intransitivePastVerbs
    : passive
      ? basicVerbs.filter((v) => v.entry.p !== "کول")
      : basicVerbs;
  return (
    <Carousel
      stickyTitle
      items={items}
      render={(item) => {
        return {
          title: (
            <InlinePs
              opts={opts}
              ps={{
                ...removeFVarients(item.entry),
                e: undefined,
              }}
            />
          ),
          body: (
            <BasicVerbChart
              passive={passive}
              ability={ability}
              verb={item}
              opts={opts}
              tense={tense}
            />
          ),
        };
      }}
    />
  );
}

export default BasicVerbShowCase;

function BasicVerbChart({
  verb,
  opts,
  tense,
  passive,
  ability,
}: {
  verb: T.VerbEntry;
  opts: T.TextOptions;
  tense: T.VerbTense | T.ImperativeTense | T.PerfectTense;
  passive?: boolean;
  ability?: boolean;
}) {
  const [voice, setVoice] = useState<"active" | "passive">("active");
  const [category, setCategory] = useState<"basic" | "ability">("basic");
  const [negative, setNegative] = useState<boolean>(false);
  const [length, setLength] = useState<"short" | "long">("short");
  const c = conjugateVerb(verb.entry, verb.complement);
  const conjugations =
    "stative" in c
      ? c.stative
      : "grammaticallyTransitive" in c
        ? c.grammaticallyTransitive
        : c;
  const phrasesForTable = makeExamplePhrases(
    verb,
    tense,
    negative,
    length,
    voice,
    category
  );
  return (
    <div>
      <div>{getEnglishVerb(verb.entry)}</div>
      {passive && (
        <div className="my-2">
          <ButtonSelect
            options={[
              {
                label: "Active",
                value: "active",
              },
              {
                label: "Passive",
                value: "passive",
              },
            ]}
            value={voice}
            handleChange={setVoice}
          />
        </div>
      )}
      {ability && (
        <div className="my-2">
          <ButtonSelect
            options={[
              {
                label: "Basic",
                value: "basic",
              },
              {
                label: "Ability",
                value: "ability",
              },
            ]}
            value={category}
            handleChange={setCategory}
          />
        </div>
      )}
      <RootsAndStems
        textOptions={opts}
        info={
          category === "ability"
            ? getAbilityRootsAndStems(conjugations.info)
            : voice === "passive"
              ? getPassiveRootsAndStems(conjugations.info) ||
              /* type safety */ conjugations.info
              : conjugations.info
        }
        hidePastParticiple={typePredicates.isPerfectTense(tense) ? false : true}
        highlighted={[tenseToStem(tense)]}
      />
      <div className="my-3 d-flex flex-row justify-content-center">
        {((isPastTense(tense) && !typePredicates.isPerfectTense(tense)) ||
          category === "ability") && (
            <div className="mx-2">
              <ButtonSelect
                handleChange={setLength}
                value={length}
                small
                options={[
                  { value: "long", label: "long" },
                  { value: "short", label: "short" },
                ]}
              />
            </div>
          )}
        <div className="mx-2">
          <ButtonSelect
            handleChange={(value) => setNegative(value === "true")}
            value={String(negative)}
            small
            options={[
              { value: "true", label: "Neg." },
              { value: "false", label: "Pos." },
            ]}
          />
        </div>
      </div>
      <div className="text-left">
        <VerbTable
          textOptions={opts}
          block={phrasesForTable.ps}
          english={phrasesForTable.e}
        />
      </div>
    </div>
  );
}

function makeExamplePhrases(
  verb: T.VerbEntry,
  tense: T.VerbTense | T.ImperativeTense | T.PerfectTense,
  negative: boolean,
  length: "short" | "long",
  voice: "active" | "passive",
  category: "basic" | "ability"
): { ps: T.VerbBlock | T.ImperativeBlock; e: T.EnglishBlock } {
  function tenseToModal(
    t: T.VerbTense | T.ImperativeTense | T.PerfectTense
  ): T.AbilityTense {
    if (typePredicates.isImperativeTense(t)) {
      throw new Error("can't have imperative tense with modal");
    }
    if (typePredicates.isPerfectTense(t)) {
      throw new Error("cant' have perfect tense with modal");
    }
    return `${t}Modal`;
  }
  function makeSelection(person: T.Person): T.VPSelectionComplete {
    return {
      blocks: [
        {
          key: Math.random(),
          block: {
            type: "subjectSelection",
            selection: {
              type: "NP",
              selection: { type: "pronoun", person: person, distance: "far" },
            },
          },
        },
        {
          key: Math.random(),
          // @ts-expect-error - bc 
          block:
            verb.entry.c?.includes("intrans.") || voice === "passive"
              ? { type: "objectSelection", selection: "none" }
              : {
                type: "objectSelection",
                selection: {
                  type: "NP",
                  selection: {
                    type: "noun",
                    entry: {
                      ts: 1527812817,
                      i: 10011,
                      p: "کتاب",
                      f: "kitáab",
                      g: "kitaab",
                      e: "book",
                      c: "n. m.",
                    },
                    gender: "masc",
                    genderCanChange: false,
                    number: "singular",
                    numberCanChange: true,
                    adjectives: [],
                  },
                },
              },
        },
      ],
      verb: {
        type: "verb",
        verb,
        tense: category === "basic" ? tense : tenseToModal(tense),
        transitivity: "intransitive",
        isCompound: false,
        voice,
        negative,
        canChangeTransitivity: false,
        canChangeVoice: false,
        canChangeStatDyn: false,
      },
      form: { removeKing: false, shrinkServant: false },
    };
  }
  function makePhrase(person: T.Person): {
    ps: T.ArrayOneOrMore<T.PsString>;
    e: string;
  } {
    const selection = makeSelection(person);
    const rendered = renderVP(selection);
    const compiled = compileVP(rendered, rendered.form);
    console.log({ rendered, compiled });
    return {
      ps: [
        modifyP(getLengthTempFix(getLength(compiled.ps, "long"), length)[0]),
      ],
      e: compiled.e
        ? modifyEnglish(compiled.e.join(" • "), tense, isThirdPerson(person))
        : "",
    };
  }
  return createVerbTable(
    makePhrase,
    typePredicates.isImperativeTense(tense)
      ? "imperative"
      : isPastTense(tense)
        ? "past"
        : "nonImperative"
  );
}

function modifyP(ps: T.PsString): T.PsString {
  return {
    p: ps.p.replace(" کتاب ", " "),
    f: ps.f.replace(" kitáab ", " "),
  };
}

function modifyEnglish(
  e: string,
  tense: T.VerbTense | T.ImperativeTense | T.PerfectTense,
  isThirdPerson: boolean
): string {
  // "kitaab" used as a dummy object
  const dummyObjectRemoved = e.replace(/\(a\/the\) +book/gi, "");
  return typePredicates.isPerfectTense(tense) || (isPastTense(tense) && isThirdPerson)
    ? dummyObjectRemoved
    : dummyObjectRemoved
      .replace(/he\/it/gi, "he/she/it")
      .replace(/We \(m\. pl\.\)/gi, "We ")
      .replace(/They \(m\. pl\.\)/gi, "They ")
      .replace(/\(m\. pl\.\)/gi, "(pl.)")
      .replace(/\(m\.\)/gi, "");
}

function tenseToStem(
  t: T.VerbTense | T.ImperativeTense | T.PerfectTense
):
  | "imperfective stem"
  | "perfective stem"
  | "imperfective root"
  | "perfective root"
  | "past participle" {
  const stem =
    t === "presentVerb"
      ? "imperfective stem"
      : t === "subjunctiveVerb"
        ? "perfective stem"
        : t === "imperfectiveFuture"
          ? "imperfective stem"
          : t === "perfectiveFuture"
            ? "perfective stem"
            : t === "imperfectivePast"
              ? "imperfective root"
              : t === "perfectivePast"
                ? "perfective root"
                : t === "habitualImperfectivePast"
                  ? "imperfective root"
                  : t === "habitualPerfectivePast"
                    ? "perfective root"
                    : t === "imperfectiveImperative"
                      ? "imperfective stem"
                      : t === "perfectiveImperative"
                        ? "perfective stem"
                        : t.endsWith("Perfect")
                          ? "past participle"
                          : "perfective root";
  return stem;
}

function createVerbTable(
  f: (person: T.Person) => { ps: T.ArrayOneOrMore<T.PsString>; e: string },
  type: "imperative" | "nonImperative" | "past"
): { ps: T.VerbBlock | T.ImperativeBlock; e: T.EnglishBlock } {
  if (type === "imperative") {
    const b = [
      [f(2), f(8)],
      [f(3), f(9)],
    ];
    return {
      ps: [
        [b[0][0].ps, b[0][1].ps],
        [b[1][0].ps, b[1][1].ps],
      ],
      e: [
        [b[0][0].e, b[0][1].e],
        [b[1][0].e, b[1][1].e],
        [b[0][0].e, b[0][1].e],
        [b[1][0].e, b[1][1].e],
        [b[0][0].e, b[0][1].e],
        [b[1][0].e, b[1][1].e],
      ],
    };
  }
  const b = [
    [f(0), f(6)],
    [f(1), f(7)],
    [f(2), f(8)],
    [f(3), f(9)],
    [f(4), f(10)],
    [f(5), f(11)],
  ];
  return {
    ps: [
      [b[0][0].ps, b[0][1].ps],
      [b[1][0].ps, b[1][1].ps],
      [b[2][0].ps, b[2][1].ps],
      [b[3][0].ps, b[3][1].ps],
      [b[4][0].ps, b[4][1].ps],
      [b[5][0].ps, b[5][1].ps],
    ],
    e: [
      [b[0][0].e, b[0][1].e],
      [b[1][0].e, b[1][1].e],
      [b[2][0].e, b[2][1].e],
      [b[3][0].e, b[3][1].e],
      [b[4][0].e, b[4][1].e],
      [b[5][0].e, b[5][1].e],
    ],
  };
}

function getLengthTempFix(
  ps: T.PsString[],
  length: "long" | "short"
): T.PsString[] {
  if (length === "short" && ps.length > 1) {
    return [ps[1]];
  }
  return [ps[0]];
}
