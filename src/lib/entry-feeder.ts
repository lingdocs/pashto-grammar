import { Types as T } from "@lingdocs/pashto-inflector";
import {
    nouns,
    verbs,
    adjectives,
    locativeAdverbs,
} from "../words/words";

const entryFeeder: T.EntryFeeder = {
    nouns,
    verbs,
    adjectives,
    locativeAdverbs,
}

export default entryFeeder;