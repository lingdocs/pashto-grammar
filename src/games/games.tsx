import EquativeGame from "./sub-cores/EquativeGame";
import VerbGame from "./sub-cores/VerbGame";
import GenderGame from "./sub-cores/GenderGame";
import UnisexNounGame from "./sub-cores/UnisexNounGame";

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
    level: "allIdentify",
    SubCore: EquativeGame,
});
export const equativeGameSituations = makeGameRecord({
    title: "Choose the right equative for the situation",
    id: "equative-past-situations",
    link: "/equatives/other-equatives",
    level: "situations",
    SubCore: EquativeGame,
});
export const equativeGameAllProduce = makeGameRecord({
    title: "Write the equative (all tenses)",
    id: "equative-past-summary-produce",
    link: "/equatives/other-equatives",
    level: "allProduce",
    SubCore: EquativeGame,
});

// VERBS
export const presentVerbGame = makeGameRecord({
    title: "Write the present verb",
    id: "present-verbs-write",
    link: "/verbs/present-verbs/",
    level: "presentVerb",
    SubCore: VerbGame,
});
export const subjunctiveVerbGame = makeGameRecord({
    title: "Write the subjunctive verb",
    id: "subjunctive-verbs-write",
    link: "/verbs/subjunctive-verbs/",
    level: "subjunctiveVerb",
    SubCore: VerbGame,
});
export const futureVerbGame = makeGameRecord({
    title: "Write the future verb",
    id: "future-verbs-write",
    link: "/verbs/future-verbs/",
    level: "futureVerb",
    SubCore: VerbGame,
});
export const imperativeVerbGame = makeGameRecord({
    title: "Write the imperative verb",
    id: "imperative-verbs-write",
    link: "/verbs/imperative-verbs/",
    level: "imperative",
    SubCore: VerbGame,
});
export const intransitivePerfectivePastVerbGame = makeGameRecord({
    title: "Write the intransitive simple past verb",
    id: "intransitive-perfective-past-verbs-write",
    link: "/verbs/past-verbs/#past-tense-with-transitive-verbs-",
    level: "intransitivePerfectivePast",
    SubCore: VerbGame,
});
export const intransitiveImperfectivePastVerbGame = makeGameRecord({
    title: "Write the intransitive continuous past verb",
    id: "transitive-imperfective-past-verbs-write",
    link: "/verbs/past-verbs/#past-tense-with-transitive-verbs-",
    level: "intransitiveImperfectivePast",
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
            presentVerbGame,
            subjunctiveVerbGame,
            futureVerbGame,
            imperativeVerbGame,
            intransitiveImperfectivePastVerbGame,
            intransitivePerfectivePastVerbGame,
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
