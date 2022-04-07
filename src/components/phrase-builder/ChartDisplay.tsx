import {
    conjugateVerb,
    VerbFormDisplay,
    Types as T,
} from "@lingdocs/pashto-inflector";
import {
    getTenseVerbForm,
} from "../../lib/phrase-building/vp-tools";

function ChartDisplay({ VS, opts }: { VS: VerbSelection, opts: T.TextOptions }) {
    const conjugations = conjugateVerb(VS.verb.entry, VS.verb.complement);
    if (!conjugations) {
        return <div>Error conjugating verb</div>;
    }
    if ("stative" in conjugations || "transitive" in conjugations) {
        return <div>Error: compound or transitivity type should be selected first</div>;
    }
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