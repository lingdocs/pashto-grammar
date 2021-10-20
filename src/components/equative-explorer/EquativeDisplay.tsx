import {
    VerbTable,
    defaultTextOptions as opts,
} from "@lingdocs/pashto-inflector";
import {
    ExplorerState,
} from "./explorer-types";
import {
    makeBlockWPronouns,
} from "./explorer-helpers";
import {
    equativeMachine,
    assembleEquativeOutput,
    NounInput,
} from "../../lib/equative-machine";
import { isPluralEntry, isSingularEntry } from "../../lib/type-predicates";

function EquativeDisplay({ state }: { state: ExplorerState }) {
    if (state.subjectType === "pronouns") {
        return <VerbTable
            textOptions={opts}
            block={makeBlockWPronouns(state.predicatesSelected[state.predicateType])}
        />
    }
    const entry = state.subjectsSelected[state.subjectType];
    const nounInput: NounInput = isSingularEntry(entry) ? {
        entry,
        plural: state.subjectsSelected.info.plural,
    } : isPluralEntry(entry) ? {
        entry,
        plural: true,
    } : {
        entry: entry as SingularEntry<Noun>,
        plural: state.subjectsSelected.info.plural,
    };
    const eq = assembleEquativeOutput(
        equativeMachine(nounInput, state.predicatesSelected[state.predicateType])
    );
    if ("short" in eq) return <div>length options not supported yet</div>;
    return <div>
        <VerbTable textOptions={opts} block={eq} />
    </div>;
}

export default EquativeDisplay;