import { useState } from "react";
import {
    defaultTextOptions as opts,
    VerbTable,
} from "@lingdocs/pashto-inflector";
import {
    makeBlockWPronouns,
} from "./explorer-helpers";
import {
    reducer,
} from "./explorer-reducer";
import {
    PredicateSelector,
} from "./explorer-selectors";
import {
    ExplorerState,
    ExplorerReducerAction,
} from "./explorer-types";
import {
    defaultUnisexNoun,
    defaultAdjective,
} from "./explorer-inputs";

// TODO: Plural nouns like shoode

const defaultState: ExplorerState = {
    predicatesSelected: {
        adjective: defaultAdjective,
        unisexNoun: defaultUnisexNoun,
    },
    predicateType: "adjective",
};

function EquativeExplorer() {
    const [state, unsafeSetState] = useState<ExplorerState>(defaultState);
    function dispatch(action: ExplorerReducerAction) {
        const newState = reducer(state, action);
        unsafeSetState(newState);
    }
    return <>
        <div className="d-flex flex-row">
            <PredicateSelector
                state={state}
                dispatch={dispatch}
            />
        </div>
        <VerbTable
            textOptions={opts}
            block={makeBlockWPronouns(state.predicatesSelected[state.predicateType])}
        />
    </>;
}

export default EquativeExplorer;