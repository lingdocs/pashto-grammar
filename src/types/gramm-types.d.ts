type EquativeTense = "present" | "subjunctive" | "habitual" | "past" | "future" | "wouldBe" | "pastSubjunctive";
type NounNumber = "singular" | "plural";

type EquativeClause = {
    subject: NounPhrase,
    predicate: NounPhrase | Compliment,
    tense: EquativeTense,
    negative?: boolean,
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
    negative: boolean,
    equative: {
        ps: import("@lingdocs/pashto-inflector").Types.SentenceForm,
        e: string[],
    },
};

type NounPhrase = Pronoun | Noun | Participle;

// The gender and number can be added, if it conflicts with the noun it will be ignored
type Noun = {
    type: "noun",
    entry: NounEntry,
    number?: NounNumber,
    gender?: import("@lingdocs/pashto-inflector").Types.Gender,
    possesor?: NounPhrase,
    adjectives?: AdjectiveEntry[],
};

type Compliment = {
    type: "compliment",
    entry: AdjectiveEntry | LocativeAdverbEntry | NounEntry, 
};

type Participle = {
    type: "participle",
    entry: VerbEntry,
    np?: NounPhrase,
}

type Pronoun = {
    type: "pronoun",
    pronounType: "near" | "far",
    person: import("@lingdocs/pashto-inflector").Types.Person,
};
