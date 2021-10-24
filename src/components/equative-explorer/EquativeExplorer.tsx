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
    predicate: {
        type: "adjective",
        adjective: defaultAdjective,
        unisexNoun: defaultUnisexNoun,
        participle: defaultParticiple,
        noun: defaultNoun,
        info: {
            plural: false,
            gender: "masc",
        },
    },
    subject: {
        type: "pronouns",
        noun: defaultNoun,
        participle: defaultParticiple,
        unisexNoun: defaultUnisexNoun,
        info: {
            plural: false,
            gender: "masc",
        },
    },
};

function EquativeExplorer() {
    const [state, unsafeSetState] = useState<ExplorerState>(defaultState);
    function dispatch(action: ExplorerReducerAction) {
        const newState = reducer(state, action);
        unsafeSetState(newState);
    }
    return <>
        <div className="row">
            <div className="col-sm">
                <TenseSelector state={state} dispatch={dispatch} />
            </div>
            <div className="col">
                <SubjectSelector state={state} dispatch={dispatch} />
            </div>
            <div className="col">
                <PredicateSelector state={state} dispatch={dispatch} />
            </div>
        </div>
        <EquativeDisplay state={state} dispatch={dispatch} />
    </>;
}

export default EquativeExplorer;