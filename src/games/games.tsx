import GenderGame from "./sub-cores/GenderGame";
import UnisexNounGame from "./sub-cores/UnisexNounGame";

function makeGameRecord(
    title: string,
    id: string,
    studyLink: string,
    game: (id: string, link: string) => (() => JSX.Element),
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

const games: { chapter: string, items: GameRecord[] }[] = [
    {
        chapter: "Nouns",
        items: [
            nounGenderGame1,
            nounGenderGame2,
            unisexNounGame,
        ],
    },
];

export default games;
