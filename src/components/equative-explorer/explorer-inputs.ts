import { nouns, adjectives } from "../../words/words";
import {
    isUnisexNoun,
} from "../../lib/type-predicates";
import { sort } from "./explorer-helpers";

const unisexNouns = nouns.filter(x => isUnisexNoun(x)) as UnisexNoun[];
const nonUnisexNouns = nouns.filter(x => !isUnisexNoun(x)) as (MascNoun | FemNoun)[];

const inputs = {
    adjective: sort(adjectives),
    unisexNoun: sort(unisexNouns),
    noun: sort(nonUnisexNouns),
};

export const defaultAdjective = inputs.adjective.find(ps => ps.p === "ستړی") || inputs.adjective[0];
export const defaultUnisexNoun = inputs.unisexNoun.find(ps => ps.p === "پښتون") || inputs.unisexNoun[0];
export const defaultNoun = inputs.noun.find(ps => ps.p === "کتاب") || inputs.noun[0];

export default inputs;