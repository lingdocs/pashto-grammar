import { ExplorerState, PredicateType } from "./explorer-types";
import { makeOptionLabel } from "./explorer-helpers";
import inputs from "./explorer-inputs";
import { ExplorerReducerAction } from "./explorer-types";

export function PredicateSelector({ state, dispatch }: {
    state: ExplorerState,
    dispatch: (action: ExplorerReducerAction) => void,
}) {
    function onTypeSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const t = e.target.value as PredicateType;
        dispatch({ type: "setPredicateType", payload: t });
    }
    function onPredicateSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        const ts = parseInt(e.target.value);
        dispatch({ type: "setPredicate", payload: ts });
    }
    return <div className="form-group">
        <label htmlFor="predicate-select"><strong>Predicate:</strong></label>
        <div className="form-check">
            <input
                className="form-check-input"
                type="radio"
                name="adjectivesPredicateRadio"
                id="adjectivesPredicateRadio"
                value="adjective"
                checked={state.predicateType === "adjective"}
                onChange={onTypeSelect}
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
                value="unisexNoun"
                checked={state.predicateType === "unisexNoun"}
                onChange={onTypeSelect}
            />
            <label className="form-check-label" htmlFor="unisexNounsPredicateRadio">
                Unisex Nouns
            </label>
        </div>
        <select
            className="form-control"
            id="predicate-select"
            value={state.predicatesSelected[state.predicateType].ts}
            onChange={onPredicateSelect}
        >
            {inputs[state.predicateType].map(e => (
                <option key={e.ts+"s"} value={e.ts}>{makeOptionLabel(e)}</option>
            ))}
        </select>
    </div>;
}