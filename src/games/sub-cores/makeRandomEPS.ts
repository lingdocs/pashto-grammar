import {
  Types as T,
  typePredicates as tp,
  makeNounSelection,
  randFromArray,
} from "@lingdocs/ps-react";
import { makePool } from "../../lib/pool";
import { wordQuery } from "../../words/words";

const pronouns: T.Person[] = [0, 1, 2, 3, 4, 4, 5, 5, 6, 7, 8, 9, 10, 11];

const tenses: T.EquativeTense[] = [
  "present",
  "habitual",
  "subjunctive",
  "future",
  "past",
  "wouldBe",
  "pastSubjunctive",
  "wouldHaveBeen",
];

const nouns = wordQuery("nouns", [
  "saRay",
  "xudza",
  "maashoom",
  "Ustaaz",
  "puxtoon",
  "DaakTar",
  "halik",
]);

const adjectives = wordQuery("adjectives", [
  "stuRay",
  "ghuT",
  "xu",
  "khufa",
  "takRa",
  "puT",
  "tuGay",
  "koochnay",
  "zoR",
  "moR",
]);

const adverbs = wordQuery("adverbs", ["دلته", "هلته"]);

const locAdverbs = adverbs.filter(tp.isLocativeAdverbEntry);

export function randomEPSPool(l: T.EquativeTense | "allTenses") {
  const pronounPool = makePool(pronouns);
  const nounPool = makePool(nouns, 20);
  const predPool = makePool([...adjectives, ...locAdverbs], 20);
  const tensePool = makePool(tenses, 15);
  function makeRandPronoun(): T.PronounSelection {
    return {
      type: "pronoun",
      distance: "far",
      person: pronounPool(),
    };
  }
  function makeRandomNoun(): T.NounSelection {
    const n = makeNounSelection(nounPool(), undefined);
    return {
      ...n,
      gender: n.genderCanChange ? randFromArray(["masc", "fem"]) : n.gender,
      number: n.numberCanChange
        ? randFromArray(["singular", "plural"])
        : n.number,
    };
  }
  return function makeRandomEPS(): T.EPSelectionComplete {
    const subj: T.NPSelection = {
      type: "NP",
      selection: randFromArray([
        makeRandPronoun,
        makeRandPronoun,
        makeRandomNoun,
        makeRandPronoun,
      ])(),
    };
    const pred = predPool();
    const tense = l === "allTenses" ? tensePool() : l;
    return makeEPS(subj, pred, tense);
  };
}

function makeEPS(
  subject: T.NPSelection,
  predicate: T.AdjectiveEntry | T.LocativeAdverbEntry,
  tense: T.EquativeTense
): T.EPSelectionComplete {
  return {
    blocks: [
      {
        key: Math.random(),
        block: {
          type: "subjectSelection",
          selection: subject,
        },
      },
    ],
    predicate: {
      type: "predicateSelection",
      selection: {
        type: "complement",
        selection: tp.isAdjectiveEntry(predicate)
          ? {
              type: "adjective",
              entry: predicate,
              sandwich: undefined,
            }
          : {
              type: "loc. adv.",
              entry: predicate,
            },
      },
    },
    equative: {
      tense,
      negative: false,
    },
    omitSubject: false,
  };
}
