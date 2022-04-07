import {
    Types as T,
} from "@lingdocs/pashto-inflector";
import Select from "react-select";
import {
    makeSelectOption,
    makeVerbSelectOption,
    zIndexProps,
} from "./np-picker/picker-tools";

function EntrySelect<E extends T.DictionaryEntry | VerbEntry>(props: {
    entries: E[],
    value: E | undefined,
    onChange: (value: E | undefined) => void,
    name: string | undefined,
    isVerbSelect?: boolean,
    opts: T.TextOptions,
}) {
    const options = props.entries
        .sort((a, b) => {
            if ("entry" in a) {
                return a.entry.p.localeCompare("p" in b ? b.p : b.entry.p, "af-PS")
            }
            return a.p.localeCompare("p" in b ? b.p : b.entry.p, "af-PS");
        })
        .map((e) => {
            if ("entry" in e) {
                return (props.isVerbSelect ? makeVerbSelectOption : makeSelectOption)(e, props.opts);
            }
            return makeSelectOption(e, props.opts);
        });
    function onSelect(v: { label: string | JSX.Element, value: string } | null) {
        if (!v) {
            props.onChange(undefined);
            return;
        }
        const s = props.entries.find(e => (
            ("entry" in e) 
                ? e.entry.ts.toString() === v.value
                : e.ts.toString() === v.value
        ));
        if (!s) return;
        props.onChange(s);
    }
    const selectedEntry: T.DictionaryEntry | undefined = !props.value
        ? undefined
        : "entry" in props.value
        ? props.value.entry
        : "p" in props.value
        ? props.value
        : undefined; 
    const selected = !selectedEntry
        ? undefined
        : options.find(o => (selectedEntry && (o.value === selectedEntry.ts.toString())));
    return <div>
        <Select
            isSearchable={true}
            value={selected}
            onChange={onSelect}
            className="mb-2"
            options={options}
            placeholder={props.name ? `Select ${props.name}...` : undefined}
            {...zIndexProps}
        />
    </div>
}

export default EntrySelect;