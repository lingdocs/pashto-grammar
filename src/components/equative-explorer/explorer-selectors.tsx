// import { makeOptionLabel } from "./explorer-helpers";
import inputs from "./explorer-inputs";
import {
    ExplorerReducerAction,
    ExplorerState,
    SubjectType,
    PredicateType,
} from "./explorer-types";
import {
    getEnglishParticiple,
} from "../../lib/np-tools";
import {
    ButtonSelect,
    getEnglishWord,
    Types as T,
    removeFVarients,
    typePredicates,
} from "@lingdocs/pashto-inflector";
import Select from "react-select";
const {
    isAdjectiveEntry,
    isAdverbEntry,
    isFemNounEntry,
    isMascNounEntry,
    isNounEntry,
    isPluralNounEntry,
} = typePredicates;

const zIndexProps = {
    menuPortalTarget: document.body, 
    styles: { menuPortal: (base: any) => ({ ...base, zIndex: 9999 }) },
};

const npTypeOptions: { type: SubjectType, label: string }[] = [
    { type: "unisexNoun", label: "Unisex Noun"},
    { type: "noun", label: "Noun" },
    { type: "participle", label: "Participle" },
];
const subjectTypeOptions: { type: SubjectType, label: string }[] = [
    { type: "pronouns" as SubjectType, label: "Pronouns" }
];
const compTypeOptions: { type: PredicateType, label: string }[] = [
    { type: "adjective", label: "Adjective" },
    { type: "adverb", label: "Loc. Adverb" },
];

export function InputSelector({ state, dispatch, entity }: {
    state: ExplorerState,
    dispatch: (action: ExplorerReducerAction) => void,
    entity: "subject" | "predicate",
}) {
    const typeOptions = [
        ...entity === "subject"
            ? subjectTypeOptions
            : compTypeOptions,
        ...npTypeOptions.filter(o => !(entity === "predicate" && (
            (state.subject.type === "pronouns" && ["noun", "participle"].includes(o.type))
            // || (state.subject.type === "unisexNoun" && o.type === "unisexNoun")
        ))),
    ];
    
    function onTypeSelect(e: React.ChangeEvent<HTMLInputElement>) {
        if (entity === "subject") {
            const t = e.target.value as SubjectType;
            dispatch({ type: "setSubjectType", payload: t });
        } else {
            const t = e.target.value as PredicateType;
            dispatch({ type: "setPredicateType", payload: t });
        }
    }

    function onEntrySelect({ value }: any) {
        dispatch({ type: entity === "subject" ? "setSubject" : "setPredicate", payload: parseInt(value) });
    }

    function CheckboxItem({ type, label }: { type: string, label: string }) {
        const id = `${entity}-${type}-radio`;
        return <div className="form-check">
            <input
                className="form-check-input"
                type="radio"
                id={id}
                value={type}
                checked={state[entity].type === type}
                onChange={onTypeSelect}
            />
            <label className="form-check-label" htmlFor={id}>
                {label}
            </label>
        </div>
    }

    const type = state[entity].type;
    const entry: T.NounEntry | T.VerbEntry | T.AdjectiveEntry | T.LocativeAdverbEntry | undefined = type === "pronouns"
        ? undefined
        // @ts-ignore
        : state[entity][type];
    const options = type === "pronouns"
        ? []
        : inputs[type].map(makeOption);

    return <div className="form-group">
        <h5 className="mb-2">{entity === "subject" ? "Subject:" : "Predicate:"}</h5>
        <div className="mb-2">
            {typeOptions.map(({ type, label }) => (
                <CheckboxItem type={type} label={label} key={`${entity}-${type}-radio`} />
            ))}
        </div>
        {type !== "pronouns" && <>
            <Select
                value={entry && ("entry" in entry ? entry.entry : entry).ts.toString()}
                onChange={onEntrySelect}
                className="mb-2"
                // @ts-ignore
                options={options}
                isSearchable
                // @ts-ignore
                placeholder={options.find(o => o.value === ("entry" in entry ? entry.entry : entry).ts.toString())?.label}
                {...zIndexProps}
            />
            {!["adjective", "adverb"].includes(type) && !(state.subject.type === "pronouns" && state.predicate.type === "unisexNoun") &&
                <GenderAndNumberSelect state={state} dispatch={dispatch} entity={entity} />
            }
        </>}
    </div>;
}

function GenderAndNumberSelect({ state, dispatch, entity }: {
    state: ExplorerState,
    dispatch: (action: ExplorerReducerAction) => void,
    entity: "subject" | "predicate",
}) {
    const type = state[entity].type;
    if (type === "pronouns") {
        return <div>ERROR: Should not display with pronouns</div>;
    }
    // @ts-ignore
    const entry: NounEntry | VerbEntry | AdverbEntry | AdjectiveEntry = state[entity][type];
    const gender = type === "noun" 
        ? (isNounEntry(entry) && isMascNounEntry(entry) ? "masc" : "fem")
        : type === "participle"
        ? "masc"
        : state[entity].info.gender;
    const pluralNounSelected = (
        type === "noun" && isPluralNounEntry(state[entity][type])
    );
    return <div className="d-flex flex-row justify-content-center mt-3">
        <div className="mr-2">
            <ButtonSelect
                small
                options={[
                    ...(type === "unisexNoun" || (type === "participle") || (isNounEntry(entry) && isMascNounEntry(entry)))
                        ? [{ label: "Masc.", value: "masc" }] : [],
                    ...(type === "unisexNoun" || ((type !== "participle") && (isNounEntry(entry) && isFemNounEntry(entry))))
                        ? [{ label: "Fem.", value: "fem" }] : [],
                ]}
                value={gender}
                handleChange={type === "noun" ? p => null : (p) => dispatch({ type: "setGender", payload: { gender: p as T.Gender, entity }})}
            />
        </div>
        <div className="ml-2">
            <ButtonSelect
                small
                options={[
                    ...(!pluralNounSelected && type !== "participle") ? [{ label: "Singular", value: "singular" }] : [],
                    { label: "Plural", value: "plural" },
                ]}
                value={(state[entity].info.number === "plural" || pluralNounSelected || type === "participle") ? "plural" : "singular"}
                handleChange={(p) => dispatch({ type: "setNumber", payload: { number: p as NounNumber, entity }})}
            />
        </div>
    </div>;
}

function makeOption(e: T.VerbEntry | T.NounEntry | T.AdjectiveEntry | T.LocativeAdverbEntry): { value: string, label: string } {
    const entry = "entry" in e ? e.entry : e;
    // TODO: THIS IS SUUUPER SKETCH
    const eng = (isNounEntry(e) || isAdjectiveEntry(e) || isAdverbEntry(e))
        ? getEnglishWord(e)
        : getEnglishParticiple(entry);
    const english = typeof eng === "string"
        ? eng
        : !eng
        ? ""
        : ("singular" in eng && eng.singular !== undefined)
        ? eng.singular
        : eng.plural;
    return {
        label: `${entry.p} - ${removeFVarients(entry.f)} (${english})`,
        value: entry.ts.toString(),
    };
}

export function TenseSelector({ state, dispatch }: {
    state: ExplorerState,
    dispatch: (action: ExplorerReducerAction) => void,
}) {
    const options: { value: EquativeTense, label: string }[] = [
        { value: "present", label: "Present" },
        { value: "habitual", label: "Habitual" },
        { value: "subjunctive", label: "Subjunctive" },
        { value: "past", label: "Past" },
        { value: "future", label: "Future" },
        { value: "wouldBe", label: '"Would Be"' },
        { value: "pastSubjunctive", label: "Past Subjunctive" },
    ];
    function onTenseSelect({ value }: any) {
        dispatch({ type: "setTense", payload: value });
    }
    return <div>
        <h5>Equative:</h5>
        <Select
            value={state.tense}
            onChange={onTenseSelect}
            className="mb-2"
            // @ts-ignore
            options={options}
            placeholder={options.find(o => o.value === state.tense)?.label}
            {...zIndexProps}
        />
        <div className="text-center mb-2">
            <ButtonSelect
                small
                options={[
                    { label: "Pos.", value: "pos" },
                    { label: "Neg.", value: "neg" },
                ]}
                value={state.negative ? "neg" : "pos"}
                handleChange={(p) => dispatch({ type: "setNegative", payload: p === "neg" })}
            />
        </div>
    </div>
}
