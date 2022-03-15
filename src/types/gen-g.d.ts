// type MascSingNounEntry = ""; // can change number only
// type FemSingNounEntry = ""; // can change nuber only
// type MascPlurNounEntry = ""; // can change nothing
// type FemPlurNounEntry = ""; // can change nothing
// type UnisexNounEntry = ""; // can change number or gender


type VPSelection = {
    type: "VPSelection",
    subject: NPSelection,
    object: Exclude<VerbObject, undefined>,
    verb: Exclude<VerbSelection, "object">,
};

// TODO: make this Rendered<VPSelection> with recursive Rendered<>
type VPRendered = {
    type: "VPRendered",
    subject: Rendered<NPSelection>,
    object: "none" | Rendered<NPSelection> | import("@lingdocs/pashto-inflector").Types.Person.ThirdPlurMale,
    verb: VerbRendered, 
}

type VerbTense = "present" | "subjunctive" | "perfectivePast" | "imperfectivePast";

type VerbSelection = {
    type: "verb",
    verb: VerbEntry,
    tense: VerbTense,
    object: VerbObject,
};

type VerbRendered = Omit<VerbSelection, "object"> & {
    ps: import("@lingdocs/pashto-inflector").Types.SingleOrLengthOpts<
        import("@lingdocs/pashto-inflector").Types.PsString[]
    >,
    person: import("@lingdocs/pashto-inflector").Types.Person,
    e?: string[],
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
    gender: import("@lingdocs/pashto-inflector").Types.Gender,
    number: NounNumber,
    // TODO: Implement
    // adjectives: [],
    // TODO: Implement
    // possesor: NPSelection | undefined,
    /* method only present if it's possible to change gender */
    changeGender?: (gender: import("@lingdocs/pashto-inflector").Types.Gender) => NounSelection, 
    /* method only present if it's possible to change number */
    changeNumber?: (number: NounNumber) => NounSelection,
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
> & {
    ps: import("@lingdocs/pashto-inflector").Types.PsString[],
    e?: string,
    inflected: boolean,
};
// TODO: recursive changing this down into the possesor etc.


// TPSelection => TPRendered => TPCompiled
// NPSelection => NPRendered => NPCompiled


