type Pronoun = {
    type: "pronoun",
    pronounType: "near" | "far",
    person: import("@lingdocs/pashto-inflector").Types.Person,
};

type BlockInput = {
    type: "NP",
    block: import("@lingdocs/pashto-inflector").Types.NPSelection,
} | {
    type: "AP",
    block: import("@lingdocs/pashto-inflector").Types.APSelection,
};
