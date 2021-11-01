import { Types as T } from "@lingdocs/pashto-inflector";

export type PredicateNPType = "noun" | "unisexNoun" | "participle";
export type PredicateCompType = "adjective" | "adverb";
export type PredicateType = PredicateNPType | PredicateCompType; 
export type SubjectType = "pronouns" | "noun" | "unisexNoun" | "participle";

export type ExplorerState = {
    tense: EquativeTense,
    length: "short" | "long",
    subject: SubjectEntityInfo,
    predicate: PredicateEntityInfo,
};

export type SubjectEntityInfo = EntitiyInfo & { type: SubjectType };

export type PredicateEntityInfo = EntitiyInfo & {
    type: PredicateType,
    adjective: AdjectiveEntry,
    adverb: LocativeAdverbEntry,
}

type EntitiyInfo = {
    noun: NounEntry,
    participle: VerbEntry,
    unisexNoun: UnisexNounEntry,
    info: {
        number: NounNumber,
        gender: T.Gender,
    },
};

export type ExplorerReducerAction = {
    type: "setPredicateType", payload: PredicateType,
} | {
    type: "setPredicate", payload: number,
} | {
    type: "setSubjectType", payload: SubjectType,
} | {
    type: "setSubject", payload: number,
} | {
    type: "setNumber", payload: { entity: "subject" | "predicate", number: NounNumber },
} | {
    type: "setGender", payload: { entity: "subject" | "predicate", gender: T.Gender },
} | {
    type: "setTense", payload: EquativeTense,
} | {
    type: "setLength", payload: "short" | "long",
};