import { nouns, adjectives } from "../../words/words";
import {
    isUnisexNoun,
} from "../../lib/type-predicates";
import { sort } from "./explorer-helpers";

const unisexNouns = nouns.filter(x => isUnisexNoun(x)) as UnisexNoun[];

const inputs = {
    adjective: sort(adjectives),
    unisexNoun: sort(unisexNouns),
};

export const defaultAdjective = inputs.adjective.find(ps => ps.p === "ستړی") || inputs.adjective[0];
export const defaultUnisexNoun = inputs.unisexNoun.find(ps => ps.p === "پښتون") || inputs.unisexNoun[0];

export default inputs;