type Progress = {
    total: number,
    current: number,
};

type Current<T> = {
    progress: Progress,
    question: T,
};

type QuestionGenerator<T> = Generator<Current<T>, void, unknown>;

type QuestionDisplayProps<T> = {
    question: T,
    callback: (correct: boolean) => void,
};

type GameRecord = {
    title: string,
    id: string,
    studyLink: string,
    Game: () => JSX.Element,
};

type Noun = import("@lingdocs/pashto-inflector").Types.DictionaryEntry & { c: string } & { __brand: "a noun entry" };
type MascNoun = Noun & { __brand2: "a masc noun entry" };
type FemNoun = Noun & { __brand2: "a fem noun entry" };
type UnisexNoun = MascNoun & { __brand3: "a unisex noun entry" };
type Adjective = import("@lingdocs/pashto-inflector").Types.DictionaryEntry & { c: string } & { __brand: "an adjective entry" };
type Verb = {
    entry: import("@lingdocs/pashto-inflector").Types.DictionaryEntry & { __brand: "a verb entry" },
    complement?: import("@lingdocs/pashto-inflector").Types.DictionaryEntry,
};

type SingularEntry<T extends Noun> = T & { __brand7: "a singular noun - as opposed to an always plural noun" };
type PluralEntry<T extends Noun> = T & { __brand7: "a noun that is always plural" };

type RawWord = T.DictionaryEntry | {
    entry: T.DictionaryEntry,
    complement?: T.DictionaryEntry,
};

// TODO: Write type predicates for these
type Pattern1Word<T> = T & { __brand3: "basic inflection pattern" };
type Pattern2Word<T> = T & { __brand3: "ending in unstressed ی pattern" };
type Pattern3Word<T> = T & { __brand3: "ending in stressed ی pattern" };
type Pattern4Word<T> = T & { __brand3: "Pashtoon pattern" };
type Pattern5Word<T> = T & { __brand3: "short squish pattern" };
type Pattern6FemNoun<T extends FemNoun> = FemNoun & { __brand3: "non anim. ending in ي" };
type NonInflecting<T> = T & { __brand3: "non-inflecting" };
// PLUS FEM INFLECTING

type Word = Noun | Adjective | Verb;

type Words = {
    nouns: Noun[],
    adjectives: Adjective[],
    verbs: Verb[],
}

type EquativeTense = "present" | "subjunctive" | "past" | "future" | "wouldBe" | "pastSubjunctive";