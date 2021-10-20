import { useState } from "react";
import {
    reducer,
} from "./explorer-reducer";
import {
    PredicateSelector,
    SubjectSelector,
} from "./explorer-selectors";
import {
    ExplorerState,
    ExplorerReducerAction,
} from "./explorer-types";
import {
    defaultUnisexNoun,
    defaultAdjective,
    defaultNoun,
    defaultParticiple,
} from "./explorer-inputs";
import EquativeDisplay from "./EquativeDisplay";

// TODO: Plural nouns like shoode

const defaultState: ExplorerState = {
    predicatesSelected: {
        adjective: defaultAdjective,
        unisexNoun: defaultUnisexNoun,
    },
    subjectsSelected: {
        noun: defaultNoun,
        participle: defaultParticiple,
        info: {
            plural: false,
            gender: "masc",
        },
    },
    predicateType: "adjective",
    subjectType: "pronouns",
};

function EquativeExplorer() {
    const [state, unsafeSetState] = useState<ExplorerState>(defaultState);
    function dispatch(action: ExplorerReducerAction) {
        const newState = reducer(state, action);
        unsafeSetState(newState);
    }
    return <>
        <div className="d-flex flex-row justify-content-between">
            <SubjectSelector state={state} dispatch={dispatch} />
            <PredicateSelector state={state} dispatch={dispatch} />
        </div>
        <EquativeDisplay state={state} />
    </>;
}

export default EquativeExplorer;