import {
    Types as T,
    typePredicates as tp,
    makeNounSelection,
    randFromArray,
} from "@lingdocs/pashto-inflector";
import { makePool } from "../../lib/pool";

const pronouns: T.Person[] = [
    0, 1, 2, 3, 4, 4, 5, 5, 6, 7, 8, 9, 10, 11,
];

const tenses: T.EquativeTense[] = [
    "present", "habitual", "subjunctive", "future", "past", "wouldBe", "pastSubjunctive", "wouldHaveBeen"
];

// @ts-ignore
const nouns: T.NounEntry[] = [
    {"ts":1527815251,"i":7790,"p":"سړی","f":"saRéy","g":"saRey","e":"man","c":"n. m.","ec":"man","ep":"men"},
    {"ts":1527812797,"i":8605,"p":"ښځه","f":"xúdza","g":"xudza","e":"woman, wife","c":"n. f.","ec":"woman","ep":"women"},
    {"ts":1527812881,"i":11691,"p":"ماشوم","f":"maashoom","g":"maashoom","e":"child, kid","c":"n. m. anim. unisex","ec":"child","ep":"children"},
    {"ts":1527815197,"i":2503,"p":"پښتون","f":"puxtoon","g":"puxtoon","e":"Pashtun","c":"n. m. anim. unisex / adj.","infap":"پښتانه","infaf":"puxtaanu","infbp":"پښتن","infbf":"puxtan"},
    {"ts":1527815737,"i":484,"p":"استاذ","f":"Ustaaz","g":"Ustaaz","e":"teacher, professor, expert, master (in a field)","c":"n. m. anim. unisex anim.","ec":"teacher"},
    {"ts":1527816747,"i":6418,"p":"ډاکټر","f":"DaakTar","g":"DaakTar","e":"doctor","c":"n. m. anim. unisex"},
    {"ts":1527812661,"i":13938,"p":"هلک","f":"halík, halúk","g":"halik,haluk","e":"boy, young lad","c":"n. m. anim."},
].filter(tp.isNounEntry);

// @ts-ignore
const adjectives: T.AdjectiveEntry[] = [
    {"ts":1527815306,"i":7582,"p":"ستړی","f":"stúRey","g":"stuRey","e":"tired","c":"adj."},
    {"ts":1527812625,"i":9116,"p":"غټ","f":"ghuT, ghaT","g":"ghuT,ghaT","e":"big, fat","c":"adj."},
    {"ts":1527812792,"i":5817,"p":"خوشاله","f":"khoshaala","g":"khoshaala","e":"happy, glad","c":"adj."},
    {"ts":1527812796,"i":8641,"p":"ښه","f":"xu","g":"xu","e":"good","c":"adj."},
    {"ts":1527812798,"i":5636,"p":"خفه","f":"khúfa","g":"khufa","e":"sad, upset, angry; choked, suffocated","c":"adj."},
    {"ts":1527822049,"i":3610,"p":"تکړه","f":"takRá","g":"takRa","e":"strong, energetic, skillful, great, competent","c":"adj."},
    {"ts":1527815201,"i":2240,"p":"پټ","f":"puT","g":"puT","e":"hidden","c":"adj."},
    {"ts":1527815381,"i":3402,"p":"تږی","f":"túGey","g":"tugey","e":"thirsty","c":"adj."},
    {"ts":1527812822,"i":10506,"p":"کوچنی","f":"koochnéy","g":"koochney","e":"little, small; child, little one","c":"adj. / n. m. anim. unisex"},
    {"ts":1527815451,"i":7243,"p":"زوړ","f":"zoR","g":"zoR","e":"old","c":"adj. irreg.","infap":"زاړه","infaf":"zaaRu","infbp":"زړ","infbf":"zaR"},
    {"ts":1527812927,"i":12955,"p":"موړ","f":"moR","g":"moR","e":"full, satisfied, sated","c":"adj. irreg.","infap":"ماړه","infaf":"maaRu","infbp":"مړ","infbf":"maR"},
].filter(tp.isAdjectiveEntry);

// @ts-ignore
const locAdverbs: T.LocativeAdverbEntry[] = [
    {"ts":1527812558,"i":6241,"p":"دلته","f":"dălta","g":"dalta","e":"here","c":"loc. adv."},
    {"ts":1527812449,"i":13937,"p":"هلته","f":"hálta, álta","g":"halta,alta","e":"there","c":"loc. adv."},
].filter(tp.isLocativeAdverbEntry);

export function randomEPSPool(l: T.EquativeTense | "allTenses") {
    const pronounPool = makePool(pronouns);
    const nounPool = makePool(nouns, 20);
    const predPool = makePool([...adjectives, ...locAdverbs], 20);
    const tensePool = makePool(tenses, 15);
    function makeRandPronoun(): T.PronounSelection {
        return {
            type: "pronoun",
            distance: "far",
            person: pronounPool(),
        };
    }
    function makeRandomNoun(): T.NounSelection {
        const n = makeNounSelection(nounPool(), undefined);
        return {
            ...n,
            gender: n.genderCanChange ? randFromArray(["masc", "fem"]) : n.gender,
            number: n.numberCanChange ? randFromArray(["singular", "plural"]) : n.number,
        };
    }
    return function makeRandomEPS(): T.EPSelectionComplete {
        const subj: T.NPSelection = {
            type: "NP",
            selection: randFromArray([
                makeRandPronoun,
                makeRandPronoun,
                makeRandomNoun,
                makeRandPronoun,
            ])(),
        };
        const pred = predPool();
        const tense = (l === "allTenses")
            ? tensePool()
            : l;
        return makeEPS(subj, pred, tense);
    }

}


function makeEPS(subject: T.NPSelection, predicate: T.AdjectiveEntry | T.LocativeAdverbEntry, tense: T.EquativeTense): T.EPSelectionComplete {
    return {
        blocks: [
            {
                key: Math.random(),
                block: {
                    type: "subjectSelection",
                    selection: subject,
                },
            },
        ],
        predicate: {
            type: "predicateSelection",
            selection: {
                type: "complement",
                selection: tp.isAdjectiveEntry(predicate) ? {
                    type: "adjective",
                    entry: predicate,
                    sandwich: undefined,
                } : {
                    type: "loc. adv.",
                    entry: predicate,
                },
            },
        },
        equative: {
            tense,
            negative: false,
        },
        omitSubject: false,
    };
}