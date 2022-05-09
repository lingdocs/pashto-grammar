import EquativeGame from "./sub-cores/EquativeGame";
import GenderGame from "./sub-cores/GenderGame";
import UnisexNounGame from "./sub-cores/UnisexNounGame";

function makeGameRecord(
    title: string,
    id: string,
    studyLink: string,
    game: (id: string, link: string) => ((s: (a: "start" | "stop") => void) => JSX.Element),
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
    (id, link) => (s: (a: "start" | "stop") => void) => <GenderGame id={id} level={1} link={link} onStartStop={s} />,
);
export const nounGenderGame2 = makeGameRecord(
    "Identify Noun Genders - Level 2",
    "gender-nouns-2",
    "/nouns/nouns-gender#exceptions",
    (id, link) => (s: (a: "start" | "stop") => void) => <GenderGame id={id} level={2} link={link} onStartStop={s} />,
);
export const unisexNounGame = makeGameRecord(
    "Changing genders on unisex nouns",
    "unisex-nouns-1",
    "/nouns/nouns-unisex/",
    (id, link) => (s: (a: "start" | "stop") => void) => <UnisexNounGame id={id} link={link} onStartStop={s} />,
);

export const equativeGamePresent = makeGameRecord(
    "Write the present equative",
    "equative-present",
    "/equatives/present-equative/",
    (id, link) => (s: (a: "start" | "stop") => void) => <EquativeGame id={id} link={link} tense="present" onStartStop={s} />,
);

export const equativeGameHabitual = makeGameRecord(
    "Write the habitual equative",
    "equative-habitual",
    "/equatives/habitual-equative/",
    (id, link) => (s: (a: "start" | "stop") => void) => <EquativeGame id={id} link={link} tense="habitual" onStartStop={s} />,
);

export const equativeGameSubjunctive = makeGameRecord(
    "Write the subjunctive equative",
    "equative-subjunctive",
    "/equatives/other-equatives/#subjunctive-equative",
    (id, link) => (s: (a: "start" | "stop") => void) => <EquativeGame id={id} link={link} tense="subjunctive" onStartStop={s} />,
);

export const equativeGameFuture = makeGameRecord(
    "Write the future equative",
    "equative-future",
    "/equatives/other-equatives/#future-equative",
    (id, link) => (s: (a: "start" | "stop") => void) => <EquativeGame id={id} link={link} tense="future" onStartStop={s} />,
);

export const equativeGamePast = makeGameRecord(
    "Write the past equative",
    "equative-past",
    "/equatives/other-equatives/#past-equative",
    (id, link) => (s: (a: "start" | "stop") => void) => <EquativeGame id={id} link={link} tense="past" onStartStop={s} />,
);

export const equativeGameWouldBe = makeGameRecord(
    'Write the "would be" equative',
    "equative-would-be",
    "equatives/other-equatives/#would-be-equative",
    (id, link) => (s: (a: "start" | "stop") => void) => <EquativeGame id={id} link={link} tense="wouldBe" onStartStop={s} />,
);

export const equativeGamePastSubjunctive = makeGameRecord(
    'Write the past subjunctive equative',
    "equative-past-subjunctive",
    "/equatives/other-equatives/#past-subjunctive",
    (id, link) => (s: (a: "start" | "stop") => void) => <EquativeGame id={id} link={link} tense="pastSubjunctive" onStartStop={s} />,
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
        ],
    },
];

export default games;
