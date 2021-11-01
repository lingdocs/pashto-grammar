import { nouns, adjectives, verbs, adverbs } from "../../words/words";
import {
    isLocativeAdverbEntry,
    isUnisexNounEntry,
} from "../../lib/type-predicates";

function sort<T extends (AdjectiveEntry | NounEntry | VerbEntry | AdverbEntry)>(arr: Readonly<T[]>): T[] {
    if ("entry" in arr[0]) {
        return [...arr].sort((a, b) => (
            // @ts-ignore
            a.entry.p.localeCompare(b.entry.p)
        ));
    }
    return [...arr].sort((a, b) => (
        // @ts-ignore
        a.p.localeCompare(b.p)
    ));
}

const unisexNouns = sort(nouns.filter(x => isUnisexNounEntry(x)) as UnisexNounEntry[]);
const nonUnisexNouns = sort(nouns.filter(x => !isUnisexNounEntry(x)) as (MascNounEntry | FemNounEntry)[]);

const inputs = {
    adjective: sort(adjectives),
    unisexNoun: unisexNouns,
    noun: nonUnisexNouns,
    participle: sort(verbs),
    adverb: sort(adverbs.filter(isLocativeAdverbEntry)),
};

export const defaultAdjective = inputs.adjective.find(ps => ps.p === "زوړ") || inputs.adjective[0];
export const defaultAdverb = inputs.adverb.find(ps => ps.p === "دلته") || inputs.adverb[0];
export const defaultUnisexNoun = inputs.unisexNoun.find(ps => ps.p === "پښتون") || inputs.unisexNoun[0];
export const defaultNoun = inputs.noun.find(ps => ps.p === "کتاب") || inputs.noun[0];
export const defaultParticiple = inputs.participle.find(ps => ps.entry.p === "لیکل") || inputs.participle[0];

export default inputs;