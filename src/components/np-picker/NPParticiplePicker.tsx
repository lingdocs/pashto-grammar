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

function NPParticiplePicker(props: ({
    verbs: VerbEntry[],
} | {
    verbs: (s: string) => VerbEntry[],
    getVerbByTs: (ts: number) => VerbEntry | undefined;
}) & {
    participle: ParticipleSelection | undefined,
    onChange: (p: ParticipleSelection | undefined) => void,
    clearButton: JSX.Element,
    opts: T.TextOptions,
}) {
    function onEntrySelect(entry: VerbEntry | undefined) {
        if (!entry) {
            props.onChange(undefined);
            return;
        }
        props.onChange(makeParticipleSelection(entry));
    }
    return <div style={{ maxWidth: "225px" }}>
        {props.clearButton}
        <EntrySelect
            value={props.participle?.verb}
            {..."getVerbByTs" in props ? {
                getByTs: props.getVerbByTs,
                searchF: props.verbs,
            } : {
                entries: props.verbs,
            }}
            onChange={onEntrySelect}
            name="Pariticple"
            opts={props.opts}
        />
        {props.participle && <div className="my-2 d-flex flex-row justify-content-around align-items-center">
            <div>Masc.</div>
            <div>Plur.</div>
        </div>}
    </div>;
}

export default NPParticiplePicker;