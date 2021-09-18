import React from "react";
import GenderGame from "./sub-cores/GenderGame";
import UnisexNounGame from "./sub-cores/UnisexNounGame";

const unisexNounsId = "unisex-nouns-1";
const nounGender1Id = "gender-nouns-1";
const nounGender2Id = "gender-nouns-2";

export const unisexNounGame: GameRecord = {
    title: "Changing genders on unisex nouns",
    id: unisexNounsId,
    Game: function() {
        // TODO: Why won't this.id word here??!
        return <UnisexNounGame id={unisexNounsId} />;
    },
}

export const nounGenderGame1: GameRecord = {
    title: "Identify Noun Genders - Level 1",
    id: nounGender1Id,
    Game: function() {
        return <GenderGame id={nounGender1Id} level={1} />;
    },
}

export const nounGenderGame2: GameRecord = {
    title: "Identify Noun Genders - Level 1",
    id: nounGender2Id,
    Game: function() {
        return <GenderGame id={nounGender2Id} level={2} />;
    },
}

const games: GameRecord[] = [
    unisexNounGame,
    nounGenderGame1,
    nounGenderGame2,
];

export default games;
