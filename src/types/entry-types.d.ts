type NounEntry = import("@lingdocs/pashto-inflector").Types.DictionaryEntry & { c: string } & { __brand: "a noun entry" };
type MascNounEntry = NounEntry & { __brand2: "a masc noun entry" };
type FemNounEntry = NounEntry & { __brand2: "a fem noun entry" };
type UnisexNounEntry = MascNounEntry & { __brand3: "a unisex noun entry" };
type AdverbEntry = import("@lingdocs/pashto-inflector").Types.DictionaryEntry & { c: string } & { __brand: "an adverb entry" };
type LocativeAdverbEntry = AdverbEntry & { __brand2: "a locative adverb entry" };
type AdjectiveEntry = import("@lingdocs/pashto-inflector").Types.DictionaryEntry & { c: string } & { __brand: "an adjective entry" };
type VerbEntry = {
    entry: import("@lingdocs/pashto-inflector").Types.DictionaryEntry & { __brand: "a verb entry" },
    // TODO: the compliment could also be typed? Maybe?
    complement?: import("@lingdocs/pashto-inflector").Types.DictionaryEntry,
};

type SingularEntry<T extends NounEntry> = T & { __brand7: "a singular noun - as opposed to an always plural noun" };
type PluralNounEntry<T extends NounEntry> = T & { __brand7: "a noun that is always plural" };

type Pattern1Entry<T> = T & { __brand3: "basic inflection pattern" };
type Pattern2Entry<T> = T & { __brand3: "ending in unstressed ی pattern" };
type Pattern3Entry<T> = T & { __brand3: "ending in stressed ی pattern" };
type Pattern4Entry<T> = T & { __brand3: "Pashtoon pattern" };
type Pattern5Entry<T> = T & { __brand3: "short squish pattern" };
type Pattern6FemEntry<T extends FemNounEntry> = T & { __brand3: "non anim. ending in ي" };
type NonInflecting<T> = T & { __brand3: "non-inflecting" };

type Entry = NounEntry | AdjectiveEntry | AdverbEntry | VerbEntry;

type Words = {
    nouns: NounEntry[],
    adjectives: AdjectiveEntry[],
    verbs: VerbEntry[],
    adverbs: AdverbEntry[],
}
