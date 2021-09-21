import React from "react";
import GenderGame from "./sub-cores/GenderGame";
import UnisexNounGame from "./sub-cores/UnisexNounGame";

function makeGameRecord(title: string, id: string, game: (id: string) => (() => JSX.Element)): GameRecord {
    return {
        title,
        id,
        Game: game(id),
    }
}

export const nounGenderGame1 = makeGameRecord(
    "Identify Noun Genders - Level 1",
    "gender-nouns-1",
    (id) => () => <GenderGame id={id} level={1} />,
);
export const nounGenderGame2 = makeGameRecord(
    "Identify Noun Genders - Level 2",
    "gender-nouns-2",
    (id) => () => <GenderGame id={id} level={2} />,
);
export const unisexNounGame = makeGameRecord(
    "Changing genders on unisex nouns",
    "unisex-nouns-1",
    (id) => () => <UnisexNounGame id={id} />,
);

const games: GameRecord[] = [
    nounGenderGame1,
    nounGenderGame2,
    unisexNounGame,
];

export default games;
