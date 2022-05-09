import EquativeGame from "./sub-cores/EquativeGame";
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

export const equativeGameAllIdentify = makeGameRecord(
    "Identify the equative (all tenses)",
    "equative-past-summary-identify",
    "/equatives/other-equatives",
    (id, link) => () => <EquativeGame id={id} link={link} level="allIdentify" />,
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
            equativeGameAllIdentify,
            equativeGameAllProduce,
        ],
    },
];

export default games;
