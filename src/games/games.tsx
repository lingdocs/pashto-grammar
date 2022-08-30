import EquativeGame from "./sub-cores/EquativeGame";
import VerbGame from "./sub-cores/VerbGame";
import GenderGame from "./sub-cores/GenderGame";
import UnisexNounGame from "./sub-cores/UnisexNounGame";

function makeGameRecord(
    title: string,
    id: string,
    studyLink: string,
    game: (id: string, link: string) => () => JSX.Element,
): GameRecord {
    return {
        title,
        studyLink,
        id,
        Game: game(id, studyLink),
    }
}

export const presentVerbGame = makeGameRecord(
    "Write the present verb",
    "present-verbs-write",
    "/verbs/present-verbs/",
    (id, link) => () => <VerbGame id={id} level="presentVerb" link={link} />
);
export const subjunctiveVerbGame = makeGameRecord(
    "Write the subjunctive verb",
    "subjunctive-verbs-write",
    "/verbs/subjunctive-verbs/",
    (id, link) => () => <VerbGame id={id} level="subjunctiveVerb" link={link} />
);
export const futureVerbGame = makeGameRecord(
    "Write the future verb",
    "future-verbs-write",
    "/verbs/future-verbs/",
    (id, link) => () => <VerbGame id={id} level="futureVerb" link={link} />
);
export const imperativeVerbGame = makeGameRecord(
    "Write the imperative verb",
    "imperative-verbs-write",
    "/verbs/imperative-verbs/",
    (id, link) => () => <VerbGame id={id} level="imperative" link={link} />
);

export const nounGenderGame1 = makeGameRecord(
    "Identify Noun Genders - Level 1",
    "gender-nouns-1",
    "/nouns/nouns-gender#gender-by-ending",
    (id, link) => () => <GenderGame id={id} level={1} link={link} />,
);
export const nounGenderGame2 = makeGameRecord(
    "Identify Noun Genders - Level 2",
    "gender-nouns-2",
    "/nouns/nouns-gender#exceptions",
    (id, link) => () => <GenderGame id={id} level={2} link={link} />,
);
export const unisexNounGame = makeGameRecord(
    "Changing genders on unisex nouns",
    "unisex-nouns-1",
    "/nouns/nouns-unisex/",
    (id, link) => () => <UnisexNounGame id={id} link={link} />,
);

export const equativeGamePresent = makeGameRecord(
    "Write the present equative",
    "equative-present",
    "/equatives/present-equative/",
    (id, link) => () => <EquativeGame id={id} link={link} level="present" />,
);

export const equativeGameHabitual = makeGameRecord(
    "Write the habitual  equative",
    "equative-habitual",
    "/equatives/habitual-equative/",
    (id, link) => () => <EquativeGame id={id} link={link} level="habitual" />,
);

export const equativeGameSubjunctive = makeGameRecord(
    "Write the subjunctive equative",
    "equative-subjunctive",
    "/equatives/other-equatives/#subjunctive-equative",
    (id, link) => () => <EquativeGame id={id} link={link} level="subjunctive" />,
);

export const equativeGameFuture = makeGameRecord(
    "Write the future equative",
    "equative-future",
    "/equatives/other-equatives/#future-equative",
    (id, link) => () => <EquativeGame id={id} link={link} level="future" />,
);

export const equativeGamePast = makeGameRecord(
    "Write the past equative",
    "equative-past",
    "/equatives/other-equatives/#past-equative",
    (id, link) => () => <EquativeGame id={id} link={link} level="past" />,
);

export const equativeGameWouldBe = makeGameRecord(
    'Write the "would be" equative',
    "equative-would-be",
    "/equatives/other-equatives/#would-be-equative",
    (id, link) => () => <EquativeGame id={id} link={link} level="wouldBe" />,
);

export const equativeGamePastSubjunctive = makeGameRecord(
    'Write the past subjunctive equative',
    "equative-past-subjunctive",
    "/equatives/other-equatives/#past-subjunctive",
    (id, link) => () => <EquativeGame id={id} link={link} level="pastSubjunctive" />,
);

export const equativeGameWouldHaveBeen = makeGameRecord(
    'Write the "would have been" equative',
    "equative-would-have-been",
    "/equatives/other-equatives/#wold-have-been-equative",
    (id, link) => () => <EquativeGame id={id} link={link} level="wouldHaveBeen" />,
);

export const equativeGameAllIdentify = makeGameRecord(
    "Identify the equative (all tenses)",
    "equative-past-summary-identify",
    "/equatives/other-equatives",
    (id, link) => () => <EquativeGame id={id} link={link} level="allIdentify" />,
);

export const equativeGameSituations = makeGameRecord(
    "Choose the right equative for the situation",
    "equative-past-situations",
    "/equatives/other-equatives",
    (id, link) => () => <EquativeGame id={id} link={link} level="situations" />,
);

export const equativeGameAllProduce = makeGameRecord(
    "Write the equative (all tenses)",
    "equative-past-summary-produce",
    "/equatives/other-equatives",
    (id, link) => () => <EquativeGame id={id} link={link} level="allProduce" />,
);

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
        ],
    }
];

export default games;
