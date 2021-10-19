import { nouns, adjectives } from "../../words/words";
import {
    isUnisexNoun,
} from "../../lib/type-predicates";
import { sort } from "./explorer-helpers";

const unisexNouns = nouns.filter(x => isUnisexNoun(x)) as UnisexNoun[];

const inputs = {
    adjectives: sort(adjectives),
    unisexNouns: sort(unisexNouns),
};

export default inputs;