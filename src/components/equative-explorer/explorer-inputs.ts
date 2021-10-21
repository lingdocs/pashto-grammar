import { nouns, adjectives, verbs } from "../../words/words";
import {
    isUnisexNoun,
} from "../../lib/type-predicates";
import { sort } from "./explorer-helpers";
import {
    ParticipleInput,
} from "../../lib/equative-machine";

const unisexNouns = sort(nouns.filter(x => isUnisexNoun(x)) as UnisexNoun[]);
const nonUnisexNouns = sort(nouns.filter(x => !isUnisexNoun(x)) as (MascNoun | FemNoun)[]);


const inputs = {
    adjective: sort(adjectives),
    unisexNoun: unisexNouns,
    noun: nonUnisexNouns,
    // @ts-ignore
    participle: sort(verbs.map(e => e.entry) as ParticipleInput[]),
};

export const defaultAdjective = inputs.adjective.find(ps => ps.p === "زوړ") || inputs.adjective[0];
export const defaultUnisexNoun = inputs.unisexNoun.find(ps => ps.p === "پښتون") || inputs.unisexNoun[0];
export const defaultNoun = inputs.noun.find(ps => ps.p === "کتاب") || inputs.noun[0];
export const defaultParticiple = inputs.participle.find(ps => ps.p === "لیکل") || inputs.participle[0];

export default inputs;