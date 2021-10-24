import {
    VerbTable,
    defaultTextOptions as opts,
    ButtonSelect,
    Types as T,
} from "@lingdocs/pashto-inflector";
import {
    ExplorerState,
    ExplorerReducerAction,
} from "./explorer-types";
import {
    makeBlockWPronouns,
} from "./explorer-helpers";
import {
    equativeMachine,
    assembleEquativeOutput,
    SubjectInput,
    PredicateInput,
    isParticipleInput,
    ParticipleInput,
} from "../../lib/equative-machine";
import { isPluralEntry, isUnisexNoun, isAdjective, isSingularEntry } from "../../lib/type-predicates";

export function chooseLength<O>(o: T.SingleOrLengthOpts<O>, length: "short" | "long"): O {
    return ("long" in o) ? o[length] : o;
}

function SingleItemDisplay({ state }: { state: ExplorerState }) {
    if (state.subject.type === "pronouns") {
        return <div>ERROR: Wrong display being used</div>;
    }
    try {
        const subjInput = makeSubjectInput(state.subject[state.subject.type], state);
        const predInput = makePredicateInput(state.predicate[state.predicate.type], state);
        const block = assembleEquativeOutput(
            equativeMachine(subjInput, predInput, state.tense)
        );
        return <div>
            <VerbTable textOptions={opts} block={chooseLength(block, state.length)} />
        </div>;
    } catch (e) {
        console.error(e);
        return <div>Error making equative sentence</div>
    }
}

function makeSubjectInput(entry: Noun | ParticipleInput | UnisexNoun, state: ExplorerState): SubjectInput {
    if (isParticipleInput(entry)) {
        return entry;
    }
    const isUnisex = isUnisexNoun(entry);
    if (isUnisex && isSingularEntry(entry)) {
        return {
            ...state.subject.info,
            entry,
        };
    }
    if (isUnisex && isPluralEntry(entry)) {
        return {
            ...state.subject.info,
            plural: true,
            entry,
        };
    }
    if (isUnisex) {
        throw new Error("improper unisex noun");
    }
    if (isPluralEntry(entry)) {
        return {
            plural: true,
            entry,
        }
    }
    if (isSingularEntry(entry)) {
        return {
            entry,
            plural: state.subject.info.plural,
        };
    }
    throw new Error("unable to make subject input from entry");
}

function makePredicateInput(entry: Noun | ParticipleInput | UnisexNoun | Adjective, state: ExplorerState): PredicateInput {
    if (isParticipleInput(entry) || isAdjective(entry)) {
        return entry;
    }
    const isUnisex = isUnisexNoun(entry);
    if (isUnisex && state.subject.type === "pronouns") {
        return entry;
    }
    if (isUnisex && isSingularEntry(entry)) {
        return {
            ...state.predicate.info,
            entry,
        };
    }
    if (isUnisex && isPluralEntry(entry)) {
        return {
            ...state.predicate.info,
            plural: true,
            entry,
        };
    }
    if (isUnisex) {
        throw new Error("improper unisex noun");
    }
    if (isPluralEntry(entry)) {
        return {
            plural: true,
            entry,
        }
    }
    if (isSingularEntry(entry)) {
        return {
            entry,
            plural: state.predicate.info.plural,
        };
    }
    throw new Error("unable to make predicate input from entry");
}

function PronounBlockDisplay({ state }: { state: ExplorerState }) {
    const pred = state.predicate[state.predicate.type];
    if (!isParticipleInput(pred) && (isAdjective(pred) || isUnisexNoun(pred))) {
        const block = makeBlockWPronouns(pred, state.tense);
        return <VerbTable
            textOptions={opts}
            block={chooseLength(block, state.length)}
        />;
    }
    return <div>Invalid combination</div>
}

function EquativeDisplay({ state, dispatch }: { state: ExplorerState, dispatch: (action: ExplorerReducerAction) => void }) {
    return <>
        {state.tense === "past" && <div className="text-center">
            <ButtonSelect
                small
                options={[
                    { label: "Long", value: "long" },
                    { label: "Short", value: "short" },
                ]}
                value={state.length}
                handleChange={(p) => dispatch({ type: "setLength", payload: p as "long" | "short" })}
            />
        </div>}
        {state.subject.type === "pronouns" 
            ? <PronounBlockDisplay state={state} /> 
            : <SingleItemDisplay state={state} />
        }
    </>;
}

export default EquativeDisplay;
