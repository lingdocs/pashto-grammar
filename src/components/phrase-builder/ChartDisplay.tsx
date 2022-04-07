import {
    conjugateVerb,
    VerbFormDisplay,
    Types as T,
} from "@lingdocs/pashto-inflector";
import {
    getTenseVerbForm,
} from "../../lib/phrase-building/vp-tools";

function ChartDisplay({ VS, opts }: { VS: VerbSelection, opts: T.TextOptions }) {
    const rawConjugations = conjugateVerb(VS.verb.entry, VS.verb.complement);
    if (!rawConjugations) {
        return <div>Error conjugating verb</div>;
    }
    const conjugations = ("stative" in rawConjugations)
        ? rawConjugations[VS.isCompound === "stative" ? "stative" : "dynamic"]
        : ("transitive" in rawConjugations)
        ? rawConjugations[VS.transitivity === "grammatically transitive" ? "grammaticallyTransitive" : "transitive"]
        : rawConjugations;
    const form = getTenseVerbForm(conjugations, VS.tense, VS.tenseCategory, VS.voice);
    return <div className="mb-4">
        <VerbFormDisplay
            displayForm={form}
            showingFormInfo={false}
            textOptions={opts}
            info={conjugations.info}
        />
    </div>;
}

export default ChartDisplay;