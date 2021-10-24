import inputs from "./explorer-inputs";
import { ExplorerState, ExplorerReducerAction } from "./explorer-types";

export function reducer(state: ExplorerState, action: ExplorerReducerAction): ExplorerState {
    if (action.type === "setPredicate") {
        const pile = inputs[state.predicate.type] as (UnisexNoun | Adjective)[];
        const predicate = (pile.find(p => p.ts === action.payload) || pile[0]);
        return {
            ...state,
            predicate: {
                ...state.predicate,
                [state.predicate.type]: predicate,
            },
        };
    }
    if (action.type === "setPredicateType") {
        const predicateType = action.payload;
        return {
            ...state,
            predicate: {
                ...state.predicate,
                type: (predicateType === "unisexNoun" && state.subject.type === "noun") ? "adjective" : predicateType,
            },
        };
    }
    if (action.type === "setSubjectType") {
        const subjectType = action.payload;
        return {
            ...state,
            predicate: {
                ...state.predicate,
                type: state.predicate.type === "unisexNoun" ? "adjective" : state.predicate.type,
            },
            subject: {
                ...state.subject,
                type: subjectType,
            }
        };
    }
    if (action.type === "setSubject") {
        if (state.subject.type === "pronouns") return state;
        const pile = inputs[state.subject.type];
        // @ts-ignore
        const subject = (pile.find(p => p.ts === action.payload) || pile[0]);
        return {
            ...state,
            subject: {
                ...state.subject,
                [state.subject.type]: subject,
            },
        };
    }
    if (action.type === "setSubjectPlural") {
        return {
            ...state,
            subject: {
                ...state.subject,
                info: {
                    ...state.subject.info,
                    plural: action.payload,
                },
            },
        };
    }
    if (action.type === "setSubjectGender") {
        return {
            ...state,
            subject: {
                ...state.subject,
                info: {
                    ...state.subject.info,
                    gender: action.payload,
                },
            },
        };
    }
    if (action.type === "setTense") {
        return {
            ...state,
            tense: action.payload,
        };
    }
    return {
        ...state,
        length: action.payload,
    };
}