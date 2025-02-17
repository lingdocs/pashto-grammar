import EquativeGame from "./sub-cores/EquativeGame";
import VerbGame from "./sub-cores/VerbGame";
import GenderGame from "./sub-cores/GenderGame";
import PluralNounGame from "./sub-cores/PluralNounGame";
import UnisexNounGame from "./sub-cores/UnisexNounGame";
import MinimalPairsGame from "./sub-cores/MinimalPairsGame";
import EquativeSituations from "./sub-cores/EquativeSituations";
import VerbSituations from "./sub-cores/VerbSituations";
import EquativeIdentify from "./sub-cores/EquativeIdentify";
import VerbFormulas from "./sub-cores/VerbFormulas";
import InflectionPatterns from "./sub-cores/InflectionPatterns";
import InflectionsWriting from "./sub-cores/InflectionsWriting";
import PerfectVerbsIntransitive from "./sub-cores/PerfectGame";
import NPAdjWriting from "./sub-cores/NPAdjGame";
import EPAdjGame from "./sub-cores/EPAdjGame";

// MINIMAL PAIRS
export const minimalPairsT = makeGameRecord({
  title: "Minimal Pairs - t and T",
  id: "minimal-pairs-t",
  link: "/writing/minimal-pairs/#ت---t-and-ټ---t",
  level: "t and T",
  SubCore: MinimalPairsGame,
});
export const minimalPairsD = makeGameRecord({
  title: "Minimal Pairs - d and D",
  id: "minimal-pairs-d",
  link: "/writing/minimal-pairs/#د---d-and-ډ---d",
  level: "d and D",
  SubCore: MinimalPairsGame,
});
export const minimalPairsR = makeGameRecord({
  title: "Minimal Pairs - r and R",
  id: "minimal-pairs-r",
  link: "/writing/minimal-pairs/#ر---r-and-ړ---r",
  level: "r and R",
  SubCore: MinimalPairsGame,
});
export const minimalPairsN = makeGameRecord({
  title: "Minimal Pairs - n and N",
  id: "minimal-pairs-n",
  link: "/writing/aiilmmn - pairs / #ن-- - n - and - ڼ-- - n",
  level: "n and N",
  SubCore: MinimalPairsGame,
});
export const minimalPairsAa = makeGameRecord({
  title: "Minimal Pairs - a and aa",
  id: "minimal-pairs-aa",
  link: "/writing/minimal-pairs/#ه---a-and-ا---aa",
  level: "a and aa",
  SubCore: MinimalPairsGame,
});
export const minimalPairsAyUy = makeGameRecord({
  title: "Minimal Pairs - ay and uy",
  id: "minimal-pairs-ay-uy",
  link: "/writing/minimal-pairs/#ی---ay-and-ۍ---uy",
  level: "ay and uy",
  SubCore: MinimalPairsGame,
});
export const minimalPairsAyE = makeGameRecord({
  title: "Minimal Pairs - ay and e",
  id: "minimal-pairs-ay-e",
  link: "/writing/minimal-pairs/#ی---ay-and-ې---e",
  level: "ay and e",
  SubCore: MinimalPairsGame,
});
export const minimalPairsEeE = makeGameRecord({
  title: "Minimal Pairs - ee and e",
  id: "minimal-pairs-ee-e",
  link: "ي - ee and ې - e",
  level: "ee and e",
  SubCore: MinimalPairsGame,
});

// NOUNS
export const nounGenderGame1 = makeGameRecord({
  title: "Identify Noun Genders - Level 1",
  id: "gender-nouns-1",
  link: "/nouns/nouns-gender#gender-by-ending",
  level: 1,
  SubCore: GenderGame,
});
export const nounGenderGame2 = makeGameRecord({
  title: "Identify Noun Genders - Level 2",
  id: "gender-nouns-2",
  link: "/nouns/nouns-gender#exceptions",
  level: 2,
  SubCore: GenderGame,
});
export const unisexNounGame = makeGameRecord({
  title: "Changing genders on unisex nouns",
  id: "unisex-nouns-1",
  link: "/nouns/nouns-unisex/",
  level: undefined,
  SubCore: UnisexNounGame,
});
export const pluralNounGame = makeGameRecord({
  title: "Making nouns plural",
  id: "plural-nouns-1",
  link: "/nouns/nouns-plural/",
  level: undefined,
  SubCore: PluralNounGame,
});

// INFLECTIONS
export const inflectionTableGame1 = makeGameRecord({
  title: "Write the inflections - Pattern #1",
  id: "write-inflections-1",
  link: "/inflection/inflection-patterns/#1-basic",
  level: 1,
  SubCore: InflectionsWriting,
});
export const inflectionTableGame2 = makeGameRecord({
  title: "Write the inflections - Pattern #2",
  id: "write-inflections-2",
  link: "/inflection/inflection-patterns/#2-words-ending-in-an-unstressed-ی---ey",
  level: 2,
  SubCore: InflectionsWriting,
});
export const inflectionTableGame3 = makeGameRecord({
  title: "Write the inflections - Pattern #3",
  id: "write-inflections-3",
  link: "/inflection/inflection-patterns/#3-words-ending-in-a-stressed-ی---éy",
  level: 3,
  SubCore: InflectionsWriting,
});
export const inflectionTableGame4 = makeGameRecord({
  title: "Write the inflections - Pattern #4",
  id: "write-inflections-4",
  link: "/inflection/inflection-patterns/#4-words-with-the-pashtoon-pattern",
  level: 4,
  SubCore: InflectionsWriting,
});
export const inflectionTableGame5 = makeGameRecord({
  title: "Write the inflections - Pattern #5",
  id: "write-inflections-5",
  link: "/inflection/inflection-patterns/#5-shorter-words-that-squish",
  level: 5,
  SubCore: InflectionsWriting,
});
export const inflectionTableGame6 = makeGameRecord({
  title: "Write the inflections - Pattern #6",
  id: "write-inflections-6",
  link: "/inflection/inflection-patterns/#6-inanimate-feminine-nouns-ending-in-ي---ee",
  level: 6,
  SubCore: InflectionsWriting,
});
export const inflectionPatternsGame1 = makeGameRecord({
  title: "Identify the inflection pattern (Level 1)",
  id: "inflection-patterns-1",
  link: "/inflection/inflection-patterns/",
  level: 1,
  SubCore: InflectionPatterns,
});
export const inflectionPatternsGame2 = makeGameRecord({
  title: "Identify the inflection pattern (Level 2)",
  id: "inflection-patterns-2",
  link: "/inflection/inflection-patterns/",
  level: 2,
  SubCore: InflectionPatterns,
});

// EQUATIVES
export const equativeGamePresent = makeGameRecord({
  title: "Write the present equative",
  id: "equative-present",
  link: "/equatives/present-equative/",
  level: "present",
  SubCore: EquativeGame,
});
export const equativeGameHabitual = makeGameRecord({
  title: "Write the habitual  equative",
  id: "equative-habitual",
  link: "/equatives/habitual-equative/",
  level: "habitual",
  SubCore: EquativeGame,
});
export const equativeGameSubjunctive = makeGameRecord({
  title: "Write the subjunctive equative",
  id: "equative-subjunctive",
  link: "/equatives/other-equatives/#subjunctive-equative",
  level: "subjunctive",
  SubCore: EquativeGame,
});
export const equativeGameFuture = makeGameRecord({
  title: "Write the future equative",
  id: "equative-future",
  link: "/equatives/other-equatives/#future-equative",
  level: "future",
  SubCore: EquativeGame,
});
export const equativeGamePast = makeGameRecord({
  title: "Write the past equative",
  id: "equative-past",
  link: "/equatives/other-equatives/#past-equative",
  level: "past",
  SubCore: EquativeGame,
});
export const equativeGameWouldBe = makeGameRecord({
  title: 'Write the "would be" equative',
  id: "equative-would-be",
  link: "/equatives/other-equatives/#would-be-equative",
  level: "wouldBe",
  SubCore: EquativeGame,
});
export const equativeGamePastSubjunctive = makeGameRecord({
  title: "Write the past subjunctive equative",
  id: "equative-past-subjunctive",
  link: "/equatives/other-equatives/#past-subjunctive",
  level: "pastSubjunctive",
  SubCore: EquativeGame,
});
export const equativeGameWouldHaveBeen = makeGameRecord({
  title: 'Write the "would have been" equative',
  id: "equative-would-have-been",
  link: "/equatives/other-equatives/#wold-have-been-equative",
  level: "wouldHaveBeen",
  SubCore: EquativeGame,
});
export const equativeGameAllIdentify = makeGameRecord({
  title: "Identify the equative (all tenses)",
  id: "equative-past-summary-identify",
  link: "/equatives/other-equatives",
  level: "allTenses",
  SubCore: EquativeIdentify,
});
export const equativeGameSituations = makeGameRecord({
  title: "Choose the right equative for the situation",
  id: "equative-past-situations",
  link: "/equatives/other-equatives",
  level: "situations",
  SubCore: EquativeSituations,
});
export const equativeGameAllProduce = makeGameRecord({
  title: "Write the equative (all tenses)",
  id: "equative-past-summary-produce",
  link: "/equatives/other-equatives",
  level: "allTenses",
  SubCore: EquativeGame,
});

// VERBS
export const presentVerbGame1 = makeGameRecord({
  title: "Write the present verb (one)",
  id: "present-verbs-write-1",
  link: "/verbs/present-verbs/",
  level: { level: 1, type: "presentVerb" },
  SubCore: VerbGame,
});
export const presentVerbGame2 = makeGameRecord({
  title: "Write the present verb (mix)",
  id: "present-verbs-write-2",
  link: "/verbs/present-verbs/",
  level: { level: 2, type: "presentVerb" },
  SubCore: VerbGame,
});
export const subjunctiveVerbGame1 = makeGameRecord({
  title: "Write the subjunctive verb (one)",
  id: "subjunctive-verbs-write-1",
  link: "/verbs/subjunctive-verbs/",
  level: { level: 1, type: "subjunctiveVerb" },
  SubCore: VerbGame,
});
export const subjunctiveVerbGame2 = makeGameRecord({
  title: "Write the subjunctive verb (mix)",
  id: "subjunctive-verbs-write-2",
  link: "/verbs/subjunctive-verbs/",
  level: { level: 2, type: "subjunctiveVerb" },
  SubCore: VerbGame,
});
export const futureVerbGame1 = makeGameRecord({
  title: "Write the future verb (one)",
  id: "future-verbs-write-1",
  link: "/verbs/future-verbs/",
  level: { level: 1, type: "futureVerb" },
  SubCore: VerbGame,
});
export const futureVerbGame2 = makeGameRecord({
  title: "Write the future verb (mix)",
  id: "future-verbs-write-2",
  link: "/verbs/future-verbs/",
  level: { level: 2, type: "futureVerb" },
  SubCore: VerbGame,
});
export const imperativeVerbGame1 = makeGameRecord({
  title: "Write the imperative verb (one)",
  id: "imperative-verbs-write-1",
  link: "/verbs/imperative-verbs/",
  level: { level: 1, type: "imperative" },
  SubCore: VerbGame,
});
export const imperativeVerbGame2 = makeGameRecord({
  title: "Write the imperative verb (mix)",
  id: "imperative-verbs-write-2",
  link: "/verbs/imperative-verbs/",
  level: { level: 2, type: "imperative" },
  SubCore: VerbGame,
});
export const intransitivePerfectivePastVerbGame1 = makeGameRecord({
  title: "Write the intransitive simple past verb (one)",
  id: "intransitive-perfective-past-verbs-write-1",
  link: "/verbs/past-verbs/#past-tense-with-intransitive-verbs-",
  level: { level: 1, type: "intransitivePerfectivePast" },
  SubCore: VerbGame,
});
export const intransitivePerfectivePastVerbGame2 = makeGameRecord({
  title: "Write the intransitive simple past verb (mix)",
  id: "intransitive-perfective-past-verbs-write-2",
  link: "/verbs/past-verbs/#past-tense-with-intransitive-verbs-",
  level: { level: 2, type: "intransitivePerfectivePast" },
  SubCore: VerbGame,
});
export const intransitiveImperfectivePastVerbGame1 = makeGameRecord({
  title: "Write the intransitive continuous past verb (one)",
  id: "intransitive-imperfective-past-verbs-write-1",
  link: "/verbs/past-verbs/#past-tense-with-intransitive-verbs-",
  level: { level: 1, type: "intransitiveImperfectivePast" },
  SubCore: VerbGame,
});
export const intransitiveImperfectivePastVerbGame2 = makeGameRecord({
  title: "Write the intransitive continuous past verb (mix)",
  id: "intransitive-imperfective-past-verbs-write-2",
  link: "/verbs/past-verbs/#past-tense-with-intransitive-verbs-",
  level: { level: 2, type: "intransitiveImperfectivePast" },
  SubCore: VerbGame,
});
export const transitivePerfectivePastVerbGame1 = makeGameRecord({
  title: "Write the transitive simple past verb (one)",
  id: "transitive-perfective-past-verbs-write-1",
  link: "/verbs/past-verbs/#past-tense-with-transitive-verbs-",
  level: { level: 1, type: "transitivePerfectivePast" },
  SubCore: VerbGame,
});
export const transitivePerfectivePastVerbGame2 = makeGameRecord({
  title: "Write the transitive simple past verb (mix)",
  id: "transitive-perfective-past-verbs-write-2",
  link: "/verbs/past-verbs/#past-tense-with-transitive-verbs-",
  level: { level: 2, type: "transitivePerfectivePast" },
  SubCore: VerbGame,
});
export const transitiveImperfectivePastVerbGame1 = makeGameRecord({
  title: "Write the transitive continuous past verb (one)",
  id: "transitive-imperfective-past-verbs-write-1",
  link: "/verbs/past-verbs/#past-tense-with-transitive-verbs-",
  level: { level: 1, type: "transitiveImperfectivePast" },
  SubCore: VerbGame,
});
export const transitiveImperfectivePastVerbGame2 = makeGameRecord({
  title: "Write the transitive continuous past verb (mix)",
  id: "transitive-imperfective-past-verbs-write-2",
  link: "/verbs/past-verbs/#past-tense-with-transitive-verbs-",
  level: { level: 2, type: "transitiveImperfectivePast" },
  SubCore: VerbGame,
});
export const habitualPastVerbGame1 = makeGameRecord({
  title: "Write the habitual past verb (one)",
  id: "habitual-past-verbs-write-1",
  link: "/verbs/past-verbs/#habitual-past-tenses",
  level: { level: 1, type: "habitualPast" },
  SubCore: VerbGame,
});
export const habitualPastVerbGame2 = makeGameRecord({
  title: "Write the habitual past verb (mix)",
  id: "habitual-past-verbs-write-2",
  link: "/verbs/past-verbs/#habitual-past-tenses",
  level: { level: 2, type: "habitualPast" },
  SubCore: VerbGame,
});
export const allPastVerbGame1 = makeGameRecord({
  title: "Write the past verb - all past tenses (one)",
  id: "all-past-verbs-write-1",
  link: "/verbs/past-verbs/",
  level: { level: 1, type: "allPast" },
  SubCore: VerbGame,
});
export const allPastVerbGame2 = makeGameRecord({
  title: "Write past verb - all past tenses (mix)",
  id: "all-past-verbs-write-2",
  link: "/verbs/past-verbs/",
  level: { level: 2, type: "allPast" },
  SubCore: VerbGame,
});
export const allVerbGame1 = makeGameRecord({
  title: "Write verb - all tenses (one)",
  id: "all-verbs-write-1",
  link: "/verbs/master-chart/",
  level: { level: 1, type: "allPast" },
  SubCore: VerbGame,
});
export const allVerbGame2 = makeGameRecord({
  title: "Write verb - all tenses (mix)",
  id: "all-verbs-write-2",
  link: "/verbs/master-chart/",
  level: { level: 2, type: "allPast" },
  SubCore: VerbGame,
});
export const verbSituationsGame = makeGameRecord({
  title: "Choose the right verb tense for the situation",
  id: "verb-tense-situations",
  link: "/verbs/verbs-intro/",
  level: "situations",
  SubCore: VerbSituations,
});
export const verbFormulasGame = makeGameRecord({
  title: "Choose the verb tense formula",
  id: "verb-tense-formulas",
  link: "/verbs/master-chart/",
  level: "all",
  SubCore: VerbFormulas,
});

export const intransitivePresentPerfectGameOne = makeGameRecord({
  title: "Write the present perfect verb - intransitive (one)",
  id: "present-perfect-intransitive-one",
  link: "/verbs/perfect-verbs-intro/",
  level: {
    level: 1,
    type: "intransitive",
  },
  SubCore: PerfectVerbsIntransitive,
});

export const intransitivePresentPerfectGameMix = makeGameRecord({
  title: "Write the present perfect verb - intransitive (mix)",
  id: "present-perfect-intransitive-mix",
  link: "/verbs/perfect-verbs-intro/",
  level: {
    level: 2,
    type: "intransitive",
  },
  SubCore: PerfectVerbsIntransitive,
});

export const presentPerfectGame = makeGameRecord({
  title: "Write the present perfect verb - transitive/intransitive mix",
  id: "present-perfect",
  link: "/verbs/perfect-verbs-intro/",
  level: {
    level: 2,
    type: "transitive-intransitive",
  },
  SubCore: PerfectVerbsIntransitive,
});

export const perfectGameOne = makeGameRecord({
  title: "Write the perfect verb - all perfect tenses (one verb)",
  id: "all-perfect-one",
  link: "/verbs/all-perfect-verbs/",
  level: {
    level: 1,
    type: "all-tenses",
  },
  SubCore: PerfectVerbsIntransitive,
});

export const perfectGameMix = makeGameRecord({
  title: "Write the perfect verb - all perfect tenses (mix)",
  id: "all-perfect-mix",
  link: "/verbs/all-perfect-verbs/",
  level: {
    level: 2,
    type: "all-tenses",
  },
  SubCore: PerfectVerbsIntransitive,
});

// ADJECTIVES
export const epWithAdjectivesHints = makeGameRecord({
  title: "Write the adjective to match the subject (with inf. pattern hints)",
  id: "adjective-predicate-hints",
  link: "/inflection/inflection-patterns/",
  level: "hints",
  SubCore: EPAdjGame,
});
export const epWithAdjectives = makeGameRecord({
  title: "Write the predicate adjective to match the subject",
  id: "adjective-predicate",
  link: "/inflection/inflection-patterns/",
  level: "no-hints",
  SubCore: EPAdjGame,
});
export const npWithAdjectivesHints = makeGameRecord({
  title: "Write the adjective and noun together (with inf. pattern hints)",
  id: "adjective-nps-hints",
  link: "/phrase-structure/np/",
  level: "hints",
  SubCore: NPAdjWriting,
});
export const npWithAdjectivesNoHints = makeGameRecord({
  title: "Write the adjective and noun together",
  id: "adjective-nps-no-hints",
  link: "/phrase-structure/np/",
  level: "no-hints",
  SubCore: NPAdjWriting,
});
export const npWithAdjectivesInSandwiches = makeGameRecord({
  title: "Write the adjective and noun together in sandwiches 🥪",
  id: "adjective-nps-in-sandwiches",
  link: "/phrase-structure/ap/#sandwich-",
  level: "sandwiches",
  SubCore: NPAdjWriting,
});

const games: { chapter: string; items: GameRecord[] }[] = [
  {
    chapter: "Minimal Pairs",
    items: [
      minimalPairsT,
      minimalPairsD,
      minimalPairsR,
      minimalPairsN,
      minimalPairsAa,
      minimalPairsAyUy,
      minimalPairsAyE,
      minimalPairsEeE,
    ],
  },
  {
    chapter: "Nouns",
    items: [nounGenderGame1, nounGenderGame2, unisexNounGame, pluralNounGame],
  },
  {
    chapter: "Inflection",
    items: [
      inflectionTableGame1,
      inflectionTableGame2,
      inflectionTableGame3,
      inflectionTableGame4,
      inflectionTableGame5,
      inflectionTableGame6,
      inflectionPatternsGame1,
      inflectionPatternsGame2,
    ],
  },
  {
    chapter: "Equatives",
    items: [
      equativeGamePresent,
      equativeGameHabitual,
      equativeGameSubjunctive,
      equativeGameFuture,
      equativeGamePast,
      equativeGameWouldBe,
      equativeGamePastSubjunctive,
      equativeGameWouldHaveBeen,
      equativeGameSituations,
      equativeGameAllIdentify,
      equativeGameAllProduce,
    ],
  },
  {
    chapter: "Verbs",
    items: [
      presentVerbGame1,
      presentVerbGame2,
      subjunctiveVerbGame1,
      subjunctiveVerbGame2,
      futureVerbGame1,
      futureVerbGame2,
      imperativeVerbGame1,
      imperativeVerbGame2,
      intransitiveImperfectivePastVerbGame1,
      intransitiveImperfectivePastVerbGame2,
      intransitivePerfectivePastVerbGame1,
      intransitivePerfectivePastVerbGame2,
      transitiveImperfectivePastVerbGame1,
      transitiveImperfectivePastVerbGame2,
      transitivePerfectivePastVerbGame1,
      transitivePerfectivePastVerbGame2,
      habitualPastVerbGame1,
      habitualPastVerbGame2,
      allPastVerbGame1,
      allPastVerbGame2,
      allVerbGame1,
      allVerbGame2,
      verbSituationsGame,
      verbFormulasGame,
    ],
  },
  {
    chapter: "Perfect Verbs",
    items: [
      intransitivePresentPerfectGameOne,
      intransitivePresentPerfectGameMix,
      presentPerfectGame,
      perfectGameOne,
      perfectGameMix,
    ],
  },
  {
    chapter: "Adjectives",
    items: [
      epWithAdjectivesHints,
      epWithAdjectives,
      npWithAdjectivesHints,
      npWithAdjectivesNoHints,
      npWithAdjectivesInSandwiches,
    ],
  },
];

// check to make sure we have no duplicate game keys
games.forEach(({ items }) => {
  const allAreUnique = (arr: unknown[]) => arr.length === new Set(arr).size;
  const ids = items.map((x) => x.id);
  const titles = items.map((x) => x.title);
  if (!allAreUnique(titles)) throw new Error("duplicate game title");
  if (!allAreUnique(ids)) throw new Error("duplicate game key");
});

export default games;

function makeGameRecord<T>({
  title,
  id,
  link,
  level,
  SubCore,
}: {
  title: string;
  id: string;
  link: string;
  level: T;
  SubCore: GameSubCore<T>;
}): GameRecord {
  return {
    title,
    id,
    Game: ({ inChapter }: { inChapter: boolean }) => (
      <SubCore inChapter={inChapter} id={id} level={level} link={link} />
    ),
  };
}
