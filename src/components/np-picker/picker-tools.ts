import {
    isNounEntry,
    isAdjectiveEntry,
    isAdverbEntry,
    isPluralNounEntry,
    isMascNounEntry,
    isUnisexNounEntry,
    isVerbEntry,
} from "../../lib/type-predicates";
import {
    getEnglishParticiple,
    getEnglishVerb,
} from "../../lib/np-tools";
import {
    getEnglishWord,
    removeFVarients,
} from "@lingdocs/pashto-inflector";

export const zIndexProps = {
    menuPortalTarget: document.body, 
    styles: { menuPortal: (base: any) => ({ ...base, zIndex: 9999 }) },
};

export function makeVerbSelectOption(e: VerbEntry): { value: string, label: string } {
    const eng = getEnglishVerb(e.entry);
    return {
        label: `${e.entry.p} - ${removeFVarients(e.entry.f)} ${eng ? `(${eng})` : ""}`,
        value: e.entry.ts.toString(),
    };
}

export function makeSelectOption(e: VerbEntry | NounEntry | AdjectiveEntry | LocativeAdverbEntry): { value: string, label: string } {
    const entry = "entry" in e ? e.entry : e;
    const eng = (isVerbEntry(e)) 
        ? (getEnglishParticiple(e.entry))
        : getEnglishWord(e);
    const english = typeof eng === "string"
        ? eng
        : !eng
        ? ""
        : ("singular" in eng && eng.singular !== undefined)
        ? eng.singular
        : eng.plural;
    return {
        label: `${entry.p} - ${removeFVarients(entry.f)} (${english})`,
        value: entry.ts.toString(),
    };
}

export function makeNounSelection(entry: NounEntry): NounSelection {
    const number = isPluralNounEntry(entry) ? "plur" : "sing";
    return {
        type: "noun",
        entry,
        gender: isMascNounEntry(entry) ? "masc" : "fem",
        number,
        ...isUnisexNounEntry(entry) ? {
            changeGender: function(gender: "masc" | "fem"): NounSelection {
                return {
                    ...this,
                    gender,
                };
            },
        } : {},
        ...number === "sing" ? {
            changeNumber: function(number: "plur" | "sing"): NounSelection {
                return {
                    ...this,
                    number,
                };
            },
        } : {},
    };
}