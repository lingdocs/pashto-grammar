// type MascSingNounEntry = ""; // can change number only
// type FemSingNounEntry = ""; // can change nuber only
// type MascPlurNounEntry = ""; // can change nothing
// type FemPlurNounEntry = ""; // can change nothing
// type UnisexNounEntry = ""; // can change number or gender

type VP = {
    subject: NPSelection,
    object: NPSelection,
    verb: VerbSelection,
};

type VerbSelection = {
    type: "verb",
    verb: VerbEntry,
    tense: "present" | "subjunctive",
    object: VerbObject,
};

type VerbObject = // intransitive verb
    "none" |
    // transitive verb - object not selected yet
    undefined |
    // transitive verb - obect selected
    NPSelection |
    // grammatically transitive verb with unspoken 3rd pers masc plur entity
    import("@lingdocs/pashto-inflector").Types.Person.ThirdPlurMale;

type NPSelection = NounSelection | PronounSelection | ParticipleSelection;

type NPType = "noun" | "pronoun" | "participle";

// TODO require/import Person and PsString
type NounSelection = {
    type: "noun",
    entry: NounEntry,
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
    person: import("@lingdocs/pashto-inflector").Types.Person,
    distance: "near" | "far",
};

type ParticipleSelection = {
    type: "participle",
    verb: VerbEntry,
};

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


