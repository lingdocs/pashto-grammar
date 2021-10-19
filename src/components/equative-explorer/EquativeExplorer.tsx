import React, { useState } from "react";
import {
    defaultTextOptions as opts,
    VerbTable,
} from "@lingdocs/pashto-inflector";
import {
    makeBlock,
    makeOptionLabel,
} from "./explorer-helpers";
import inputs from "./explorer-inputs";
import { reducer, ExplorerReducerAction } from "./explorer-reducer";

export type PredicateType = "adjectives" | "unisexNouns";
const predicateTypes: PredicateType[] = ["adjectives", "unisexNouns"];
// type SubjectType = "pronouns" | "nouns";

// TODO: Plural nouns like shoode

export type ExplorerState = {
    predicate: Adjective | UnisexNoun,
    predicateType: PredicateType,
};
const defaultState: ExplorerState = {
    predicate: inputs.adjectives.find(ps => ps.p === "ستړی") || inputs.adjectives[0],
    predicateType: "adjectives",
};

function EquativeExplorer() {
    const [state, unsafeSetState] = useState<ExplorerState>(defaultState);
    function dispatch(action: ExplorerReducerAction) {
        const newState = reducer(state, action);
        unsafeSetState(newState);
    }
    function handlePredicateSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        dispatch({ type: "setPredicate", payload: parseInt(e.target.value) });
    }
    function handlePredicateTypeSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const payload = e.target.value as PredicateType;
        dispatch({ type: "setPredicateType", payload });
    }
    return <>
        <div className="d-flex flex-row">
            {/* <div className="form-group">
                <label htmlFor="subject-select"><strong>Subject:</strong></label>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="pronounsSubjectRadio"
                        id="pronounsSubjectRadio"
                        value={subjectTypes[0]}
                        checked={subjectType === "pronouns"}
                        onChange={handleSubjectTypeSelect}
                    />
                    <label className="form-check-label" htmlFor="pronounsSubjectRadio">
                        Pronouns
                    </label>
                </div>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="nounsSubjectRadio"
                        id="nounsSubjectRadio"
                        value={subjectTypes[0]}
                        checked={subjectType === "nouns"}
                        onChange={handleSubjectTypeSelect}
                    />
                    <label className="form-check-label" htmlFor="nounsSubjectRadio">
                        Nouns
                    </label>
                </div>
            </div> */}
            <div className="form-group">
                <label htmlFor="predicate-select"><strong>Predicate:</strong></label>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="adjectivesPredicateRadio"
                        id="adjectivesPredicateRadio"
                        value={predicateTypes[0]}
                        checked={state.predicateType === "adjectives"}
                        onChange={handlePredicateTypeSelect}
                    />
                    <label className="form-check-label" htmlFor="adjectivesPredicateRadio">
                        Adjectives
                    </label>
                </div>
                <div className="form-check mb-2">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="unisexNounsPredicateRadio"
                        id="unisexNounsPredicateRadio"
                        value={predicateTypes[1]}
                        checked={state.predicateType === "unisexNouns"}
                        onChange={handlePredicateTypeSelect}
                    />
                    <label className="form-check-label" htmlFor="unisexNounsPredicateRadio">
                        Unisex Nouns
                    </label>
                </div>
                <select
                    className="form-control"
                    id="predicate-select"
                    value={state.predicate.ts}
                    onChange={handlePredicateSelect}
                >
                    {inputs[state.predicateType].map(e => (
                        <option key={e.ts+"s"} value={e.ts}>{makeOptionLabel(e)}</option>
                    ))}
                </select>
            </div>
        </div>
        <VerbTable textOptions={opts} block={makeBlock(state.predicate)} />
    </>;
}

export default EquativeExplorer;