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
} from "../../lib/equative-machine";
import { isNoun, isPluralEntry, isUnisexNoun } from "../../lib/type-predicates";

export function chooseLength<O>(o: T.SingleOrLengthOpts<O>, length: "short" | "long"): O {
    return ("long" in o) ? o[length] : o;
}

function SingleItemDisplay({ state }: { state: ExplorerState }) {
    if (state.subjectType === "pronouns") {
        return <div>ERROR: Wrong display being used</div>;
    }
    const entry = state.subjectsSelected[state.subjectType];
    // @ts-ignore - TODO: safer and for use with unisex nouns
    const subjInput: SubjectInput = isNoun(entry) ? {
        entry,
        plural: isPluralEntry(entry) ? true : state.subjectsSelected.info.plural,
        ...isUnisexNoun(entry) ? {
            gender: state.subjectsSelected.info.gender,
        } : {},
    } : entry;

    const block = assembleEquativeOutput(
        equativeMachine(subjInput, state.predicatesSelected[state.predicateType], state.tense)
    );
    return <div>
        <VerbTable textOptions={opts} block={chooseLength(block, state.length)} />
    </div>;
}

function PronounBlockDisplay({ state }: { state: ExplorerState }) {
    const block = makeBlockWPronouns(state.predicatesSelected[state.predicateType], state.tense);
    return <VerbTable
        textOptions={opts}
        block={chooseLength(block, state.length)}
    />;
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
        {state.subjectType === "pronouns" 
            ? <PronounBlockDisplay state={state} /> 
            : <SingleItemDisplay state={state} />
        }
    </>;
}

export default EquativeDisplay;
