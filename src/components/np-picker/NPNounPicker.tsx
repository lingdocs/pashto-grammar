import Select from "react-select";
import {
    makeSelectOption,
    zIndexProps,
    makeNounSelection,
} from "./picker-tools";
import {
    ButtonSelect,
} from "@lingdocs/pashto-inflector";


function NPNounPicker({ onChange, noun, nouns }: { nouns: NounEntry[], noun: NounSelection | undefined, onChange: (p: NounSelection) => void }) {
    const options = nouns.sort((a, b) => (a.p.localeCompare(b.p, "af-PS"))).map(makeSelectOption)
    function onEntrySelect({ value }: { label: string, value: string }) {
        const entry = nouns.find(n => n.ts.toString() === value);
        if (!entry) {
            console.error("entry not found");
            return;
        }
        onChange(makeNounSelection(entry));
    }
    return <div style={{ maxWidth: "225px", minWidth: "125px" }}>
        <Select
            value={noun && noun.entry.ts.toString()}
            // @ts-ignore
            onChange={onEntrySelect}
            className="mb-2"
            // @ts-ignore
            options={options}
            isSearchable
            // // @ts-ignore

            placeholder={noun ? options.find(o => o.value === (noun.entry).ts.toString())?.label : "Select Noun..."}
            {...zIndexProps}
        />
        {noun && <div className="my-2 d-flex flex-row justify-content-around align-items-center">
            <div>
                {noun.changeGender ? <ButtonSelect
                    small
                    options={[
                        { label: "Masc", value: "masc" },
                        { label: "Fem", value: "fem" },
                    ]}
                    value={noun.gender}
                    handleChange={(g) => {
                        if (!noun.changeGender) return;
                        onChange(noun.changeGender(g));
                    }}
                /> : noun.gender === "masc" ? "Masc." : "Fem."}
            </div>
            <div>
                {noun.changeNumber ? <ButtonSelect
                    small
                    options={[
                        { label: "Sing.", value: "singular" },
                        { label: "Plur.", value: "plural" },
                    ]}
                    value={noun.number}
                    handleChange={(n) => {
                        if (!noun.changeNumber) return;
                        onChange(noun.changeNumber(n));
                    }}
                /> : noun.number === "singular" ? "Sing." : "Plur."}
            </div>
        </div>}
    </div>;
}

export default NPNounPicker;