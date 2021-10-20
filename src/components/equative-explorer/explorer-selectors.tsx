import { makeOptionLabel } from "./explorer-helpers";
import inputs from "./explorer-inputs";
import {
    ExplorerReducerAction,
    ExplorerState,
    PredicateType,
    SubjectType,
} from "./explorer-types";
import {
    ButtonSelect,
} from "@lingdocs/pashto-inflector";
import { isPluralEntry } from "../../lib/type-predicates";

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
    return <div className="form-group ml-2">
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
                disabled={state.subjectType !== "pronouns"}
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

export function SubjectSelector({ state, dispatch }: {
    state: ExplorerState,
    dispatch: (action: ExplorerReducerAction) => void,
}) {
    function onTypeSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const t = e.target.value as SubjectType;
        dispatch({ type: "setSubjectType", payload: t });
    }
    function onSubjectSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        const ts = parseInt(e.target.value);
        dispatch({ type: "setSubject", payload: ts });
    }
    const pluralNounSelected = (
        state.subjectType === "noun" && isPluralEntry(state.subjectsSelected.noun)
    )
    return <div className="form-group mr-2">
        <label htmlFor="predicate-select"><strong>Subject:</strong></label>
        <div className="form-check">
            <input
                className="form-check-input"
                type="radio"
                name="pronounsSubjectRadio"
                id="pronounsSubjectRadio"
                value="pronouns"
                checked={state.subjectType === "pronouns"}
                onChange={onTypeSelect}
            />
            <label className="form-check-label" htmlFor="adjectivesPredicateRadio">
                Pronouns
            </label>
        </div>
        <div className="form-check mb-2">
            <input
                className="form-check-input"
                type="radio"
                name="nounsSubjectRadio"
                id="nounsSubjectRadio"
                value="noun"
                checked={state.subjectType === "noun"}
                onChange={onTypeSelect}
            />
            <label className="form-check-label" htmlFor="unisexNounsPredicateRadio">
                Nouns
            </label>
        </div>
        {state.subjectType !== "pronouns" && 
            <>
                <select
                    className="form-control mb-3"
                    id="subject-select"
                    value={state.subjectsSelected[state.subjectType].ts}
                    onChange={onSubjectSelect}
                >
                    {inputs[state.subjectType].map(e => (
                        <option key={e.ts+"s"} value={e.ts}>{makeOptionLabel(e)}</option>
                    ))}
                </select>
                <ButtonSelect
                    small
                    options={[
                        ...!pluralNounSelected ? [{ label: "Singular", value: "singular" }] : [],
                        { label: "Plural", value: "plural" },
                    ]}
                    value={(state.subjectsSelected.info.plural || pluralNounSelected) ? "plural" : "singular"}
                    handleChange={(p) => dispatch({ type: "setSubjectPlural", payload: p === "plural" ? true : false })}
                />
            </>
        }
    </div>;
}