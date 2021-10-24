import { Types as T } from "@lingdocs/pashto-inflector";
import { ParticipleInput } from "../../lib/equative-machine";

export type PredicateType = "adjective" | "noun" | "unisexNoun" | "participle";
export type SubjectType = "pronouns" | "noun" | "unisexNoun" | "participle";

export type ExplorerState = {
    tense: EquativeTense,
    length: "short" | "long",
    subject: SubjectEntityInfo,
    predicate: PredicateEntityInfo,
};

export type SubjectEntityInfo = EntitiyInfo & { type: SubjectType };

export type PredicateEntityInfo = EntitiyInfo & { type: PredicateType, adjective: Adjective };

type EntitiyInfo = {
    noun: Noun,
    participle: ParticipleInput,
    unisexNoun: UnisexNoun,
    info: {
        plural: boolean,
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
    type: "setSubjectPlural", payload: boolean,
} | {
    type: "setSubjectGender", payload: T.Gender,
} | {
    type: "setTense", payload: EquativeTense,
} | {
    type: "setLength", payload: "short" | "long",
};