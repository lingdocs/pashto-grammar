import inputs from "./explorer-inputs";
import { ExplorerState, ExplorerReducerAction } from "./explorer-types";

export function reducer(state: ExplorerState, action: ExplorerReducerAction): ExplorerState {
    if (action.type === "setPredicate") {
        const pile = inputs[state.predicate.type] as (UnisexNounEntry | AdjectiveEntry)[];
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
                type: predicateType,
            },
        };
    }
    if (action.type === "setSubjectType") {
        const subjectType = action.payload;
        return {
            ...state,
            subject: {
                ...state.subject,
                type: subjectType,
            },
            predicate: {
                ...state.predicate,
                type: (
                    subjectType === "pronouns" &&
                    !["adjective", "adverb", "unisexNoun"].includes(state.predicate.type)
                ) ? "adjective" : state.predicate.type,
            },
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
    if (action.type === "setNumber") {
        const entity = action.payload.entity;
        return {
            ...state,
            [entity]: {
                ...state[entity],
                info: {
                    ...state[entity].info,
                    number: action.payload.number,
                },
            },
        };
    }
    if (action.type === "setGender") {
        const entity = action.payload.entity;
        return {
            ...state,
            [entity]: {
                ...state[entity],
                info: {
                    ...state[entity].info,
                    gender: action.payload.gender,
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
    // if (action.type === "setPredicateEntity") {
    //     return {
    //         ...state,
    //         predicate: {
    //             ...state.predicate,
    //             entity: action.payload,
    //         },
    //     };
    // }
    if (action.type === "setNegative") {
        return {
            ...state,
            negative: action.payload,
        };
    }
    return {
        ...state,
        length: action.payload,
    };
}