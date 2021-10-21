import inputs from "./explorer-inputs";
import { ExplorerState, ExplorerReducerAction } from "./explorer-types";

export function reducer(state: ExplorerState, action: ExplorerReducerAction): ExplorerState {
    if (action.type === "setPredicate") {
        const pile = inputs[state.predicateType] as (UnisexNoun | Adjective)[];
        const predicate = (pile.find(p => p.ts === action.payload) || pile[0]);
        return {
            ...state,
            predicatesSelected: {
                ...state.predicatesSelected,
                [state.predicateType]: predicate,
            },
        };
    }
    if (action.type === "setPredicateType") {
        const predicateType = action.payload;
        return {
            ...state,
            predicateType: (predicateType === "unisexNoun" && state.subjectType === "noun") ? "adjective" : predicateType, 
        };
    }
    if (action.type === "setSubjectType") {
        const subjectType = action.payload;
        return {
            ...state,
            predicateType: state.predicateType === "unisexNoun" ? "adjective" : state.predicateType,
            subjectType,
        };
    }
    if (action.type === "setSubject") {
        if (state.subjectType === "pronouns") return state;
        const pile = inputs[state.subjectType];
        // @ts-ignore
        const subject = (pile.find(p => p.ts === action.payload) || pile[0]);
        return {
            ...state,
            subjectsSelected: {
                ...state.subjectsSelected,
                [state.subjectType]: subject,
            },
        };
    }
    if (action.type === "setSubjectPlural") {
        return {
            ...state,
            subjectsSelected: {
                ...state.subjectsSelected,
                info: {
                    ...state.subjectsSelected.info,
                    plural: action.payload,
                },
            },
        };
    }
    return {
        ...state,
        subjectsSelected: {
            ...state.subjectsSelected,
            info: {
                ...state.subjectsSelected.info,
                gender: action.payload,
            },
        },
    };
}