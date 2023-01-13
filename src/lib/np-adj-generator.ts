import {
    Types as T,
    makeNounSelection,
    makeAdjectiveSelection,
    randFromArray,
} from "@lingdocs/ps-react";
import { makePool } from "./pool";
import { wordQuery } from "../words/words";

const nouns = wordQuery("nouns", [
    "saRey",
    "xudza",
    "maashoom",
    "Ustaaz",
    "puxtoon",
    "DaakTar",
    "halik",
    "tajriba",
    "melma",
    "khabura",
    "kitaab",
    "oobu",
    "korba",
    "shpoon",
    "gaawanDey",
    "lmasey",
    "lobghaaRey",
    "sandurghaaRey",
    "malgurey",
    "shpoonkey",
    "khalk",
    "ghul",
    "khur",
]);

const adjectives = wordQuery("adjectives", [
    "muR",
    "sheen",
    "soor",
    "rixtooney",
    "pakhwaaney",
    "stuRey",
    "ooGd",
    "ghuT",
    "xu",
    "khufa",
    "takRa",
    "puT",
    "tuGey",
    "koochney",
    "wroostey",
    "pradey",
    "zoR",
    "moR",
    "treekh",
    "oom",
    "khoG",
    "droond",
    "loomRey",
    "Roond",
    "prot",
    "soR",
    "post",
    "pokh",
    "rooN",
    "woR",
    "tod",
    "khpor",
    "kooN",
    "koG",
    "zeeG",
]);

export function makeNPAdjGenerator(avoidPlurals?: boolean): () => T.NPSelection {
    const nounPool = makePool(nouns);
    const adjPool = makePool(adjectives);

    return () => {
        const ns = makeNounSelection(nounPool(), undefined);
        const selection: T.NounSelection = {
            ...ns,
            adjectives: [makeAdjectiveSelection(adjPool())],
            ...(ns.numberCanChange && !avoidPlurals) ? {
                number: randFromArray(["singular", "plural", "plural", "plural", "singular"]),
            } : {},
            ...ns.genderCanChange ? {
                gender: randFromArray(["masc", "fem", "fem", "fem", "masc"]),
            } : {},
        };
        return {
            type: "NP",
            selection,
        };
    };
}

