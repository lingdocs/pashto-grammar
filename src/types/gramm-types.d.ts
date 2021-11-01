type EquativeTense = "present" | "subjunctive" | "past" | "future" | "wouldBe" | "pastSubjunctive";
type NounNumber = "singular" | "plural";

type EquativeClause = {
    subject: NounPhrase,
    predicate: NounPhrase | Compliment,
    tense: EquativeTense,
};

type EquativeClauseOutput = {
    subject: {
        ps: (import("@lingdocs/pashto-inflector").Types.PsString)[],
        e: string,
    },
    predicate: {
        ps: (import("@lingdocs/pashto-inflector").Types.PsString)[],
        e: string,
    },
    ba: boolean,
    equative: {
        ps: import("@lingdocs/pashto-inflector").Types.SentenceForm,
        e: string[],
    },
};

type NounPhrase = Pronoun | Noun | Participle;

// TODO: better, simpler type here
type Noun = {
    type: "unisex noun",
    number: NounNumber,
    gender: import("@lingdocs/pashto-inflector").Types.Gender,
    entry: UnisexNounEntry,
    possesor?: Noun,
    adjectives?: AdjectiveEntry[],
} | {
    type: "plural noun",
    entry: PluralNounEntry<MascNounEntry | FemNounEntry>,
    possesor?: Noun,
    adjectives?: AdjectiveEntry[],
} | {
    type: "singular noun",
    number: NounNumber,
    entry: SingularEntry<MascNounEntry | FemNounEntry>,
    possesor?: Noun,
    adjectives?: AdjectiveEntry[],
};

type Compliment = {
    type: "compliment",
    entry: AdjectiveEntry | LocativeAdverbEntry | NounEntry, 
};

type Participle = {
    type: "participle",
    entry: VerbEntry,
}

type Pronoun = {
    type: "pronoun",
    pronounType: "near" | "far",
    person: import("@lingdocs/pashto-inflector").Types.Person,
};
