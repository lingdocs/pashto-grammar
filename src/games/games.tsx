import EquativeGame from "./sub-cores/EquativeGame";
import VerbGame from "./sub-cores/VerbGame";
import GenderGame from "./sub-cores/GenderGame";
import UnisexNounGame from "./sub-cores/UnisexNounGame";
import EquativeSituations from "./sub-cores/EquativeSituations";
import EquativeIdentify from "./sub-cores/EquativeIdentify";

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
    title: 'Write the past subjunctive equative',
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
    level: { level: 1, type :"presentVerb" },
    SubCore: VerbGame,
});
export const presentVerbGame2 = makeGameRecord({
    title: "Write the present verb (mix)",
    id: "present-verbs-write-2",
    link: "/verbs/present-verbs/",
    level: { level: 2, type :"presentVerb" },
    SubCore: VerbGame,
});
export const subjunctiveVerbGame1 = makeGameRecord({
    title: "Write the subjunctive verb (one)",
    id: "subjunctive-verbs-write-1",
    link: "/verbs/subjunctive-verbs/",
    level: { level: 1, type :"subjunctiveVerb" },
    SubCore: VerbGame,
});
export const subjunctiveVerbGame2 = makeGameRecord({
    title: "Write the subjunctive verb (mix)",
    id: "subjunctive-verbs-write-2",
    link: "/verbs/subjunctive-verbs/",
    level: { level: 2, type :"subjunctiveVerb" },
    SubCore: VerbGame,
});
export const futureVerbGame1 = makeGameRecord({
    title: "Write the future verb (one)",
    id: "future-verbs-write-1",
    link: "/verbs/future-verbs/",
    level: { level: 1, type :"futureVerb" },
    SubCore: VerbGame,
});
export const futureVerbGame2 = makeGameRecord({
    title: "Write the future verb (mix)",
    id: "future-verbs-write-2",
    link: "/verbs/future-verbs/",
    level: { level: 2, type :"futureVerb" },
    SubCore: VerbGame,
});
export const imperativeVerbGame1 = makeGameRecord({
    title: "Write the imperative verb (one)",
    id: "imperative-verbs-write-1",
    link: "/verbs/imperative-verbs/",
    level: { level: 1, type :"imperative" },
    SubCore: VerbGame,
});
export const imperativeVerbGame2 = makeGameRecord({
    title: "Write the imperative verb (mix)",
    id: "imperative-verbs-write-2",
    link: "/verbs/imperative-verbs/",
    level: { level: 2, type :"imperative" },
    SubCore: VerbGame,
});
export const intransitivePerfectivePastVerbGame1 = makeGameRecord({
    title: "Write the intransitive simple past verb (one)",
    id: "intransitive-perfective-past-verbs-write-1",
    link: "/verbs/past-verbs/#past-tense-with-intransitive-verbs-",
    level: { level: 1, type :"intransitivePerfectivePast" },
    SubCore: VerbGame,
});
export const intransitivePerfectivePastVerbGame2 = makeGameRecord({
    title: "Write the intransitive simple past verb (mix)",
    id: "intransitive-perfective-past-verbs-write-2",
    link: "/verbs/past-verbs/#past-tense-with-intransitive-verbs-",
    level: { level: 2, type :"intransitivePerfectivePast" },
    SubCore: VerbGame,
});
export const intransitiveImperfectivePastVerbGame1 = makeGameRecord({
    title: "Write the intransitive continuous past verb (one)",
    id: "intransitive-imperfective-past-verbs-write-1",
    link: "/verbs/past-verbs/#past-tense-with-intransitive-verbs-",
    level: { level: 1, type :"intransitiveImperfectivePast" },
    SubCore: VerbGame,
});
export const intransitiveImperfectivePastVerbGame2 = makeGameRecord({
    title: "Write the intransitive continuous past verb (mix)",
    id: "intransitive-imperfective-past-verbs-write-2",
    link: "/verbs/past-verbs/#past-tense-with-intransitive-verbs-",
    level: { level: 2, type :"intransitiveImperfectivePast" },
    SubCore: VerbGame,
});
export const transitivePerfectivePastVerbGame1 = makeGameRecord({
    title: "Write the transitive simple past verb (one)",
    id: "transitive-perfective-past-verbs-write-1",
    link: "/verbs/past-verbs/#past-tense-with-transitive-verbs-",
    level: { level: 1, type :"transitivePerfectivePast" },
    SubCore: VerbGame,
});
export const transitivePerfectivePastVerbGame2 = makeGameRecord({
    title: "Write the transitive simple past verb (mix)",
    id: "transitive-perfective-past-verbs-write-2",
    link: "/verbs/past-verbs/#past-tense-with-transitive-verbs-",
    level: { level: 2, type :"transitivePerfectivePast" },
    SubCore: VerbGame,
});
export const transitiveImperfectivePastVerbGame1 = makeGameRecord({
    title: "Write the transitive continuous past verb (one)",
    id: "transitive-imperfective-past-verbs-write",
    link: "/verbs/past-verbs/#past-tense-with-transitive-verbs-",
    level: { level: 1, type :"transitiveImperfectivePast" },
    SubCore: VerbGame,
});
export const transitiveImperfectivePastVerbGame2 = makeGameRecord({
    title: "Write the transitive continuous past verb (mix)",
    id: "transitive-imperfective-past-verbs-write-2",
    link: "/verbs/past-verbs/#past-tense-with-transitive-verbs-",
    level: { level: 2, type :"transitiveImperfectivePast" },
    SubCore: VerbGame,
});

const games: { chapter: string, items: GameRecord[] }[] = [
    {
        chapter: "Nouns",
        items: [
            nounGenderGame1,
            nounGenderGame2,
            unisexNounGame,
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
        ],
    }
];

export default games;

function makeGameRecord<T>({ title, id, link, level, SubCore }:{
    title: string,
    id: string,
    link: string,
    level: T,
    SubCore: GameSubCore<T>,
}): GameRecord {
    return {
        title,
        id,
        Game: ({ inChapter }: { inChapter: boolean }) => (
            <SubCore inChapter={inChapter} id={id} level={level} link={link} />
        ),
    }
}
