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
    SubjectInput,
} from "../../lib/equative-machine";
import { isNoun, isPluralEntry, isUnisexNoun } from "../../lib/type-predicates";

function EquativeDisplay({ state }: { state: ExplorerState }) {
    if (state.subjectType === "pronouns") {
        return <VerbTable
            textOptions={opts}
            block={makeBlockWPronouns(state.predicatesSelected[state.predicateType])}
        />
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

    const eq = assembleEquativeOutput(
        equativeMachine(subjInput, state.predicatesSelected[state.predicateType])
    );
    if ("short" in eq) return <div>length options not supported yet</div>;
    return <div>
        <VerbTable textOptions={opts} block={eq} />
    </div>;
}

export default EquativeDisplay;