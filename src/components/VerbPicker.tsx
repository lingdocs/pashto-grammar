import Select from "react-select";
import {
    makeVerbSelectOption,
    zIndexProps,
} from "./np-picker/picker-tools";
import {
    Types as T,
} from "@lingdocs/pashto-inflector";

const tenseOptions = [{
    label: "present",
    value: "present",
}, {
    label: "subjunctive",
    value: "subjunctive",
}];

function makeVerbSelection(verb: VerbEntry, oldVerbSelection?: VerbSelection): VerbSelection {
    function getTransObjFromOldVerbSelection() {
        if (!oldVerbSelection || oldVerbSelection.object === "none" || typeof oldVerbSelection.object === "number") return undefined;
        return oldVerbSelection.object;
    }
    // TODO: more complex types and unchangeable dynamic compound objects
    const verbType: "intrans" | "trans" | "gramm trans" = verb.entry.c?.includes("v. intrans.")
        ? "intrans"
        : verb.entry.c?.includes("v. gramm. trans.")
        ? "gramm trans"
        : "trans";
    const object = verbType === "gramm trans"
        ? T.Person.ThirdPlurMale
        : verbType === "trans"
        ? getTransObjFromOldVerbSelection()
        : "none";
    return {
        type: "verb",
        verb,
        tense: oldVerbSelection ? oldVerbSelection.tense : "present",
        object,
    };
}

function VerbPicker({ onChange, verb, verbs }: { verbs: VerbEntry[], verb: VerbSelection | undefined, onChange: (p: VerbSelection) => void }) {
    const options = verbs.map(makeVerbSelectOption)
    function onEntrySelect({ value }: { label: string, value: string }) {
        const v = verbs.find(v => v.entry.ts.toString() === value);
        if (!v) {
            console.error("entry not found");
            return;
        }
        onChange(makeVerbSelection(v, verb));
    }
    function onTenseSelect({ value }: { label: string, value: "present" | "subjunctive" }) {
        if (verb) {
            onChange({
                ...verb,
                tense: value,
            });
        }
    }
    return <div style={{ maxWidth: "225px" }}>
        <div>Verb:</div>
        <Select
            value={verb && verb.verb.entry.ts.toString()}
            // @ts-ignore
            onChange={onEntrySelect}
            className="mb-2"
            // @ts-ignore
            options={options}
            isSearchable
            // // @ts-ignore
            placeholder={verb ? options.find(o => o.value === (verb.verb.entry).ts.toString())?.label : "Select Verb..."}
            {...zIndexProps}
        />
        <div>Tense:</div>
        <Select
            value={verb && verb.tense}
            // @ts-ignore
            onChange={onTenseSelect}
            className="mb-2"
            // @ts-ignore
            options={tenseOptions}
            isSearchable
            placeholder={verb ? tenseOptions.find(o => o.value === verb.tense)?.value : "Select Tense..."}
            {...zIndexProps}
        />
    </div>;
}

export default VerbPicker;