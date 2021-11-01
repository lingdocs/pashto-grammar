import { useState } from "react";
import {
    reducer,
} from "./explorer-reducer";
import {
    InputSelector,
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
    defaultAdverb,
} from "./explorer-inputs";
import EquativeDisplay from "./EquativeDisplay";

const defaultState: ExplorerState = {
    tense: "present",
    length: "short",
    predicate: {
        type: "adjective",
        adjective: defaultAdjective,
        adverb: defaultAdverb,
        unisexNoun: defaultUnisexNoun,
        participle: defaultParticiple,
        noun: defaultNoun,
        info: {
            number: "singular",
            gender: "masc",
        },
    },
    subject: {
        type: "pronouns",
        noun: defaultNoun,
        participle: defaultParticiple,
        unisexNoun: defaultUnisexNoun,
        info: {
            number: "singular",
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
        <TenseSelector state={state} dispatch={dispatch} />
        <div className="row">
            <div className="col">
                <InputSelector entity="subject" state={state} dispatch={dispatch} />
            </div>
            <div className="col">
                <InputSelector entity="predicate" state={state} dispatch={dispatch} />
            </div>
        </div>
        <EquativeDisplay state={state} dispatch={dispatch} />
    </>;
}

export default EquativeExplorer;