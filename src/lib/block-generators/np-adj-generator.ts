import {
  Types as T,
  makeNounSelection,
  makeAdjectiveSelection,
  randFromArray,
} from "@lingdocs/ps-react";
import { makePool } from "../pool";
import { wordQuery } from "../../words/words";

const nouns = wordQuery("nouns", [
  "saRay",
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
  "gaawanDay",
  "lmasay",
  "lobghaaRay",
  "sandurghaaRay",
  "malguray",
  "shpoonkay",
  "khalk",
  "ghul",
  "khur",
]);

const adjectives = wordQuery("adjectives", [
  "muR",
  "jzwunday",
  "sheen",
  "soor",
  "rixtoonay",
  "pakhwaanay",
  "stuRay",
  "ooGd",
  "ghuT",
  "xu",
  "khufa",
  "takRa",
  "puT",
  "tuGay",
  "koochnay",
  "wroostay",
  "praday",
  "treew",
  "zoR",
  "moR",
  "treekh",
  "oom",
  "khoG",
  "droond",
  "loomRay",
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
  "naast",
]);

export function makeNPAdjGenerator(
  pluralsLevel: "none" | "low" | "high"
): () => T.NPSelection {
  const nounPool = makePool(nouns);
  const adjPool = makePool(adjectives);

  return () => {
    const ns = makeNounSelection(nounPool(), undefined);
    const selection: T.NounSelection = {
      ...ns,
      adjectives: [makeAdjectiveSelection(adjPool())],
      ...(ns.numberCanChange && pluralsLevel !== "none"
        ? {
            number: randFromArray(
              pluralsLevel === "high"
                ? ["singular", "plural", "plural", "plural", "singular"]
                : ["singular", "plural", "singular"]
            ),
          }
        : {}),
      ...(ns.genderCanChange
        ? {
            gender: randFromArray(["masc", "fem", "fem", "fem", "masc"]),
          }
        : {}),
    };
    return {
      type: "NP",
      selection,
    };
  };
}
