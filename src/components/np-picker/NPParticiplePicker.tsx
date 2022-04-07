import EntrySelect from "../EntrySelect";
import {
    Types as T,
} from "@lingdocs/pashto-inflector";

function makeParticipleSelection(verb: VerbEntry): ParticipleSelection {
    return {
        type: "participle",
        verb,
    };
}

function NPParticiplePicker({ onChange, participle, verbs, clearButton, opts }: {
    verbs: VerbEntry[],
    participle: ParticipleSelection | undefined,
    onChange: (p: ParticipleSelection | undefined) => void,
    clearButton: JSX.Element,
    opts: T.TextOptions,
}) {
    function onEntrySelect(entry: VerbEntry | undefined) {
        if (!entry) {
            onChange(undefined);
            return;
        }
        onChange(makeParticipleSelection(entry));
    }
    return <div style={{ maxWidth: "225px" }}>
        {clearButton}
        <EntrySelect
            value={participle?.verb}
            entries={verbs}
            onChange={onEntrySelect}
            name="Pariticple"
            opts={opts}
        />
        {participle && <div className="my-2 d-flex flex-row justify-content-around align-items-center">
            <div>Masc.</div>
            <div>Plur.</div>
        </div>}
    </div>;
}

export default NPParticiplePicker;