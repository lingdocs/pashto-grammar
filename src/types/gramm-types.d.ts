type Pronoun = {
    type: "pronoun",
    pronounType: "near" | "far",
    person: import("@lingdocs/pashto-inflector").Types.Person,
};

type BlockInput = { type: "NP", block: T.NPSelection };
