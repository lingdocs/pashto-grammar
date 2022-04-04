import {
    ButtonSelect,
} from "@lingdocs/pashto-inflector";
import {
    makeVerbSelection,
} from "./phrase-builder/verb-selection";
import EntrySelect from "./EntrySelect";

// TODO: dark on past tense selecitons

function VerbPicker({ onChange, subject, changeSubject, verb, verbs }: {
    verbs: VerbEntry[],
    verb: VerbSelection | undefined,
    subject: NPSelection | undefined,
    onChange: (p: VerbSelection | undefined) => void,
    changeSubject: (p: NPSelection | undefined) => void,
}) {
    // const [filters, useFilters] = useState<Filters>({
    //     stative: true,
    //     dynamic: true,
    //     transitive: true,
    //     intransitive: true,
    //     grammaticallyTransitive: true,
    // });
    function onVerbSelect(v: VerbEntry | undefined) {
        // TODO: what to do when clearing
        if (!v) {
            return onChange(v);
        }
        onChange(makeVerbSelection(v, changeSubject, verb));
    }
    function onVoiceSelect(value: "active" | "passive") {
        if (verb && verb.changeVoice) {
            if (value === "passive" && (typeof verb.object === "object")) {
                changeSubject(verb.object);
            }
            if (value === "active") {
                changeSubject(undefined);
            }
            onChange(verb.changeVoice(value, value === "active" ? subject : undefined));
        }
    }
    function notInstransitive(t: "transitive" | "intransitive" | "grammatically transitive"): "transitive" | "grammatically transitive" {
        return t === "intransitive" ? "transitive" : t;
    }
    function handleChangeTransitivity(t: "transitive" | "grammatically transitive") {
        if (verb && verb.changeTransitivity) {
            onChange(verb.changeTransitivity(t));
        }
    }
    function handleChangeStatDyn(c: "stative" | "dynamic") {
        if (verb && verb.changeStatDyn) {
            onChange(verb.changeStatDyn(c));
        }
    }
    return <div className="mb-3">
        <div style={{ maxWidth: "300px", margin: "0 auto" }}>
            <div className="h5">Verb:</div>
            <EntrySelect
                entries={verbs}
                value={verb?.verb}
                onChange={onVerbSelect}
                name="Verb"
                isVerbSelect
            />
        </div>
        <div className="d-flex flex-row justify-content-around flex-wrap" style={{ maxWidth: "400px", margin: "0 auto" }}>
            {verb && verb.changeTransitivity && <div className="text-center my-2">
                <ButtonSelect
                    small
                    options={[{
                        label: "gramm. trans.",
                        value: "grammatically transitive",
                    }, {
                        label: "trans.",
                        value: "transitive",
                    }]}
                    value={notInstransitive(verb.transitivity)}
                    handleChange={handleChangeTransitivity}
                />
            </div>}
            {verb && verb.changeVoice && <div className="text-center my-2">
                <ButtonSelect
                    small
                    value={verb.voice}
                    options={[{
                        label: "Active",
                        value: "active",
                    }, {
                        label: "Passive",
                        value: "passive",
                    }]}
                    handleChange={onVoiceSelect}
                />
            </div>}
            {verb && verb.changeStatDyn && <div className="text-center my-2">
                <ButtonSelect
                    small
                    options={[{
                        label: "stative",
                        value: "stative",
                    }, {
                        label: "dynamic",
                        value: "dynamic",
                    }]}
                    value={verb.isCompound ? verb.isCompound : "stative"}
                    handleChange={handleChangeStatDyn}
                />
            </div>}
        </div>
    </div>;
}


export default VerbPicker;