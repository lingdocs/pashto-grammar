import inputs from "./explorer-inputs";
import { PredicateType, ExplorerState } from "./EquativeExplorer";

export type ExplorerReducerAction = {
    type: "setPredicateType", payload: PredicateType,
} | {
    type: "setPredicate", payload: number,
};

export function reducer(state: ExplorerState, action: ExplorerReducerAction): ExplorerState {
    if (action.type === "setPredicate") {
        const pile = inputs[state.predicateType] as (UnisexNoun | Adjective)[];
        const predicate = (pile.find(p => p.ts === action.payload) || pile[0]);
        return {
            ...state,
            predicate,
        };
    }
    // if (action.type === "setPredicateType") {
        const predicate = inputs[action.payload][0];
        return {
            predicate,
            predicateType: action.payload,
        };
    // }
}