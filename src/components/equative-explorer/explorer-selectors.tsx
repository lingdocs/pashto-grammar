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
    Types as T,
} from "@lingdocs/pashto-inflector";
import { isPluralEntry } from "../../lib/type-predicates";
import Select from "react-select";

const zIndexProps = {
    menuPortalTarget: document.body, 
    styles: { menuPortal: (base: any) => ({ ...base, zIndex: 9999 }) },
};

export function SubjectSelector({ state, dispatch }: {
    state: ExplorerState,
    dispatch: (action: ExplorerReducerAction) => void,
}) {
    function onTypeSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const t = e.target.value as SubjectType;
        dispatch({ type: "setSubjectType", payload: t });
    }
    function onSubjectSelect({ value }: any) {
        dispatch({ type: "setSubject", payload: parseInt(value) });
    }
    const pluralNounSelected = (
        state.subjectType === "noun" && isPluralEntry(state.subjectsSelected.noun)
    );
    const options = state.subjectType === "pronouns"
        ? []
        : inputs[state.subjectType].map(e => ({
            value: e.ts.toString(),
            label: makeOptionLabel(e),
        }));
    const subject = state.subjectType === "pronouns"
        ? undefined
        : state.subjectsSelected[state.subjectType];
    return <div className="form-group mr-2 flex-fill">
        <label htmlFor="predicate-select"><h5>Subject:</h5></label>
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
        <div className="form-check">
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
        <div className="form-check">
            <input
                className="form-check-input"
                type="radio"
                name="unisexNounsSubjectRadio"
                id="unisexNounsSubjectRadio"
                value="unisexNoun"
                checked={state.subjectType === "unisexNoun"}
                onChange={onTypeSelect}
            />
            <label className="form-check-label" htmlFor="unisexNounsPredicateRadio">
                Unisex Nouns
            </label>
        </div>
        <div className="form-check mb-2">
            <input
                className="form-check-input"
                type="radio"
                name="participlesSubjectRadio"
                id="participlesSubjectRadio"
                value="participle"
                checked={state.subjectType === "participle"}
                onChange={onTypeSelect}
            />
            <label className="form-check-label" htmlFor="unisexNounsPredicateRadio">
                Participles
            </label>
        </div>
        {state.subjectType !== "pronouns" && 
            <>
                <Select
                    value={subject?.ts.toString()}
                    onChange={onSubjectSelect}
                    className="mb-2"
                    // @ts-ignore
                    options={options}
                    isSearchable
                    placeholder={options.find(o => o.value === subject?.ts.toString())?.label}
                    {...zIndexProps}
                />
                <div className="d-flex flex-row justify-content-center">
                    {state.subjectType !== "participle" && <div className={state.subjectType === "unisexNoun" ? "mr-2" : ""}>
                        <ButtonSelect
                            small
                            options={[
                                ...!pluralNounSelected ? [{ label: "Singular", value: "singular" }] : [],
                                { label: "Plural", value: "plural" },
                            ]}
                            value={(state.subjectsSelected.info.plural || pluralNounSelected) ? "plural" : "singular"}
                            handleChange={(p) => dispatch({ type: "setSubjectPlural", payload: p === "plural" ? true : false })}
                        />
                    </div>}
                    {state.subjectType === "unisexNoun" && <div className="ml-2">
                        <ButtonSelect
                        small
                        options={[
                            { label: "Masc.", value: "masc" },
                            { label: "Fem.", value: "fem" },
                        ]}
                        value={state.subjectsSelected.info.gender}
                        handleChange={(p) => dispatch({ type: "setSubjectGender", payload: p as T.Gender })}
                        />
                    </div>}
                </div>
            </>
        }
    </div>;
}

export function PredicateSelector({ state, dispatch }: {
    state: ExplorerState,
    dispatch: (action: ExplorerReducerAction) => void,
}) {
    function onTypeSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const t = e.target.value as PredicateType;
        dispatch({ type: "setPredicateType", payload: t });
    }
    function onPredicateSelect({ value }: any) {
        dispatch({ type: "setPredicate", payload: parseInt(value) });
    }
    const options = inputs[state.predicateType].map(e => ({
        value: `${e.ts}`,
        label: makeOptionLabel(e),
    }));
    const predicate = state.predicatesSelected[state.predicateType];
    return <div className="form-group ml-2 flex-fill" style={{ maxWidth: "50%" }}>
        <label htmlFor="predicate-select"><h5>Predicate:</h5></label>
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
        <Select
            value={predicate.ts.toString()}
            onChange={onPredicateSelect}
            className="mb-2"
            // @ts-ignore
            options={options}
            isSearchable
            placeholder={options.find(o => o.value === predicate.ts.toString())?.label}
            {...zIndexProps}
        />
    </div>;
}

