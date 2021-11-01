import {
    Types as T,
    getEnglishWord,
    inflectWord,
    isUnisexSet,
    personGender,
    personIsPlural,
} from "@lingdocs/pashto-inflector";
import { isAdjectiveEntry, isLocativeAdverbEntry } from "./type-predicates";
import {
    psStringFromEntry,
} from "./text-tools";

export function evaluateCompliment(c: Compliment, person: T.Person): { ps: T.PsString[], e: string } {
    const e = getEnglishWord(c.entry);
    if (!e || typeof e !== "string") {
        console.log(e);
        throw new Error("error getting english for compliment");
    }
    if (isLocativeAdverbEntry(c.entry)) {
        return {
            ps: [psStringFromEntry(c.entry)],
            e,
        };
    }
    if (isAdjectiveEntry(c.entry)) {
        const infs = inflectWord(c.entry);
        if (!infs) return {
            ps: [psStringFromEntry(c.entry)],
            e,
        }
        if (!infs.inflections || !isUnisexSet(infs.inflections)) {
            throw new Error("error getting inflections for adjective, looks like a noun's inflections");
        }
        return {
            ps: chooseInflection(infs.inflections, person),
            e,
        };
    }
    throw new Error("noun complements not yet implemented");
}

function chooseInflection(inflections: T.UnisexSet<T.InflectionSet>, pers: T.Person): T.ArrayOneOrMore<T.PsString> {
    return inflections[personGender(pers)][personIsPlural(pers) ? 1 : 0];
}