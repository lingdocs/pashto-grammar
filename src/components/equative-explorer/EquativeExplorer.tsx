import { useState } from "react";
import {
    reducer,
} from "./explorer-reducer";
import {
    PredicateSelector,
    SubjectSelector,
    TenseSelector,
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

const defaultState: ExplorerState = {
    tense: "present",
    length: "short",
    predicatesSelected: {
        adjective: defaultAdjective,
        unisexNoun: defaultUnisexNoun,
    },
    subjectsSelected: {
        noun: defaultNoun,
        participle: defaultParticiple,
        unisexNoun: defaultUnisexNoun,
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
        <TenseSelector state={state} dispatch={dispatch} />
        <div className="d-flex flex-row justify-content-between align-items-center mt-2">
            <SubjectSelector state={state} dispatch={dispatch} />
            <PredicateSelector state={state} dispatch={dispatch} />
        </div>
        <EquativeDisplay state={state} dispatch={dispatch} />
    </>;
}

export default EquativeExplorer;