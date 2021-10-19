export type PredicateType = keyof PredicatesSelected;

export type ExplorerState = {
    predicateType: PredicateType,
    predicatesSelected: PredicatesSelected,
};
type PredicatesSelected = {
    adjective: Adjective,
    unisexNoun: UnisexNoun,
};

export type ExplorerReducerAction = {
    type: "setPredicateType", payload: PredicateType,
} | {
    type: "setPredicate", payload: number,
};