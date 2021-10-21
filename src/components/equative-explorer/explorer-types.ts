import { Types as T } from "@lingdocs/pashto-inflector";
import { ParticipleInput } from "../../lib/equative-machine";

export type PredicateType = keyof PredicatesSelected;
export type SubjectType = "noun" | "pronouns" | "participle" | "unisexNoun";

export type ExplorerState = {
    subjectType: SubjectType,
    subjectsSelected: SubjectSelected,
    predicateType: PredicateType,
    predicatesSelected: PredicatesSelected,
};
type PredicatesSelected = {
    adjective: Adjective,
    unisexNoun: UnisexNoun,
};
type SubjectSelected = {
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
};