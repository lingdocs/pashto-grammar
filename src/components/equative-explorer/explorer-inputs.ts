import { nouns, adjectives, verbs, adverbs } from "../../words/words";
import {
    Types as T,
    typePredicates as tp,
} from "@lingdocs/pashto-inflector";

function sort<T extends (T.AdjectiveEntry | T.NounEntry | T.VerbEntry | T.AdverbEntry)>(arr: Readonly<T[]>): T[] {
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

const unisexNouns = sort(nouns.filter(x => tp.isUnisexNounEntry(x)) as T.UnisexNounEntry[]);
const nonUnisexNouns = sort(nouns.filter(x => !tp.isUnisexNounEntry(x)) as (T.MascNounEntry | T.FemNounEntry)[]);

const inputs = {
    adjective: sort(adjectives),
    unisexNoun: unisexNouns,
    noun: nonUnisexNouns,
    participle: sort(verbs),
    adverb: sort(adverbs.filter(tp.isLocativeAdverbEntry)),
};

export const defaultAdjective = inputs.adjective.find(ps => ps.p === "زوړ") || inputs.adjective[0];
export const defaultAdverb = inputs.adverb.find(ps => ps.p === "دلته") || inputs.adverb[0];
export const defaultUnisexNoun = inputs.unisexNoun.find(ps => ps.p === "پښتون") || inputs.unisexNoun[0];
export const defaultNoun = inputs.noun.find(ps => ps.p === "کتاب") || inputs.noun[0];
export const defaultParticiple = inputs.participle.find(ps => ps.entry.p === "لیکل") || inputs.participle[0];

export default inputs;