import {
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
    Types as T,
    InlinePs,
} from "@lingdocs/pashto-inflector";

export const zIndexProps = {
    menuPortalTarget: document.body, 
    styles: { menuPortal: (base: any) => ({ ...base, zIndex: 9999 }) },
};

export function makeVerbSelectOption(e: VerbEntry, opts: T.TextOptions): { value: string, label: string | JSX.Element } {
    const eng = getEnglishVerb(e.entry);
    return {
        label: <InlinePs opts={opts}>
            {{ p: e.entry.p, f: removeFVarients(e.entry.f), e: eng }}
        </InlinePs>,
        value: e.entry.ts.toString(),
    };
}

export function makeSelectOption(
    e: T.DictionaryEntry | VerbEntry | NounEntry | AdjectiveEntry | LocativeAdverbEntry,
    opts: T.TextOptions,    
): { value: string, label: JSX.Element | string } {
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
        label: <InlinePs opts={opts}>
            {{ p: entry.p, f: removeFVarients(entry.f), e: english }}
        </InlinePs>,
        value: entry.ts.toString(),
    };
}

export function makeNounSelection(entry: NounEntry, dynamicComplement?: true): NounSelection {
    const number = isPluralNounEntry(entry) ? "plural" : "singular";
    return {
        type: "noun",
        entry,
        gender: isMascNounEntry(entry) ? "masc" : "fem",
        number,
        dynamicComplement,
        ...isUnisexNounEntry(entry) ? {
            changeGender: function(gender: T.Gender): NounSelection {
                return {
                    ...this,
                    gender,
                };
            },
        } : {},
        ...number === "singular" ? {
            changeNumber: function(number: NounNumber): NounSelection {
                return {
                    ...this,
                    number,
                };
            },
        } : {},
    };
}