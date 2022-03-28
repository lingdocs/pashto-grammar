import Select from "react-select";
import {
    makeSelectOption,
    zIndexProps,
} from "./picker-tools";

function makeParticipleSelection(verb: VerbEntry): ParticipleSelection {
    return {
        type: "participle",
        verb,
    };
}

function NPParticiplePicker({ onChange, participle, verbs, clearButton }: {
    verbs: VerbEntry[],
    participle: ParticipleSelection | undefined,
    onChange: (p: ParticipleSelection) => void,
    clearButton: JSX.Element,
}) {
    const options = verbs.map(makeSelectOption)
    function onEntrySelect({ value }: { label: string, value: string }) {
        const verb = verbs.find(v => v.entry.ts.toString() === value);
        if (!verb) {
            console.error("entry not found");
            return;
        }
        onChange(makeParticipleSelection(verb));
    }
    return <div style={{ maxWidth: "225px" }}>
        {clearButton}
        <Select
            value={participle && participle.verb.entry.ts.toString()}
            // @ts-ignore
            onChange={onEntrySelect}
            className="mb-2"
            // @ts-ignore
            options={options}
            isSearchable
            // // @ts-ignore
            placeholder={participle ? options.find(o => o.value === (participle.verb.entry).ts.toString())?.label : "Select Participle..."}
            {...zIndexProps}
        />
        {participle && <div className="my-2 d-flex flex-row justify-content-around align-items-center">
            <div>Masc.</div>
            <div>Plur.</div>
        </div>}
    </div>;
}

export default NPParticiplePicker;