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

export function getLong<U>(x: T.SingleOrLengthOpts<U>): U {
    if ("long" in x) {
        return x.long;
    }
    return x;
}

export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}