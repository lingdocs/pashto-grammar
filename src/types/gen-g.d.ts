// type MascSingNounEntry = ""; // can change number only
// type FemSingNounEntry = ""; // can change nuber only
// type MascPlurNounEntry = ""; // can change nothing
// type FemPlurNounEntry = ""; // can change nothing
// type UnisexNounEntry = ""; // can change number or gender

type NPSelection = NounSelection | PronounSelection | ParticipleSelection;

type NPType = "noun" | "pronoun" | "participle";

// TODO require/import Person and PsString
type NounSelection = {
    type: "noun",
    ps: import("@lingdocs/pashto-inflector").Types.PsString,
    entry: import("@lingdocs/pashto-inflector").Types.DictionaryEntry,
    // BETTER TO USE (or keep handy) FULL ENTRY FOR USE WITH INFLECTING
    e: {
        sing: string,
        plur: string,
    } | undefined,
    gender: "masc" | "fem",
    number: "sing" | "plur",
    // TODO: Implement
    // adjectives: [],
    // TODO: Implement
    // possesor: NPSelection | undefined,
    /* method only present if it's possible to change gender */
    changeGender?: (gender: "masc" | "fem") => NounSelection, 
    /* method only present if it's possible to change number */
    changeNumber?: (number: "sing" | "plur") => NounSelection,
};

// take an argument for subject/object in rendering English
type PronounSelection = {
    type: "pronoun",
    e: string,
    person: import("@lingdocs/pashto-inflector").Types.Person,
    distance: "near" | "far",
};

type ParticipleSelection = {
    type: "participle",
    ps: import("@lingdocs/pashto-inflector").Types.PsString,
    e: string | undefined,
    // entry in here
}

// not object
// type Primitive = string | Function | number | boolean | Symbol | undefined | null;
// If T has key K ("user"), replace it
type ReplaceKey<T, K extends string, R> = T extends Record<K, unknown> ? (Omit<T, K> & Record<K, R>) : T;


type Rendered<T extends NPSelection> = ReplaceKey<
    Omit<T, "changeGender" | "changeNumber" | "changeDistance">,
    "e",
    string
> & { inflected: boolean };
// TODO: recursive changing this down into the possesor etc.


// TPSelection => TPRendered => TPCompiled
// NPSelection => NPRendered => NPCompiled


