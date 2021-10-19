import {
    Types as T,
    removeFVarients,
    getEnglishWord,
} from "@lingdocs/pashto-inflector";
import {
    equativeMachine,
    assembleEquativeOutput,
} from "../../lib/equative-machine";

export function sort(arr: Adjective[]): Adjective[];
export function sort(arr: UnisexNoun[]): UnisexNoun[];
export function sort(arr: (Adjective | UnisexNoun)[]): (Adjective | UnisexNoun)[] {
    return arr.sort((a, b) => a.p.localeCompare(b.p));
}

export function makeBlock(e: Adjective | UnisexNoun): T.VerbBlock {
    const makeP = (p: T.Person): T.ArrayOneOrMore<T.PsString> => {
        const b = assembleEquativeOutput(equativeMachine(p, e));
        return ("long" in b ? b.long : b) as T.ArrayOneOrMore<T.PsString>;
    };
    return [
        [makeP(0), makeP(6)],
        [makeP(1), makeP(7)],
        [makeP(2), makeP(8)],
        [makeP(3), makeP(9)],
        [makeP(4), makeP(10)],
        [makeP(5), makeP(11)],
    ];
}

export function makeOptionLabel(e: T.DictionaryEntry): string {
    const eng = getEnglishWord(e);
    const english = typeof eng === "string" ? eng : eng?.singular; 
    return `${e.p} - ${removeFVarients(e.f)} (${english})`;
}