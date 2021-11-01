import {
    Types as T,
    removeFVarients,
} from "@lingdocs/pashto-inflector";

export function firstVariation(s: string): string {
    return s.split(/[,|;]/)[0].trim();
}

export function psStringFromEntry(entry: T.PsString): T.PsString {
    return {
        p: entry.p,
        f: removeFVarients(entry.f),
    };
}