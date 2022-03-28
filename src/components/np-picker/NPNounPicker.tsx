import Select from "react-select";
import {
    makeSelectOption,
    zIndexProps,
    makeNounSelection,
} from "./picker-tools";
import {
    ButtonSelect,
    InlinePs,
    defaultTextOptions as opts,
} from "@lingdocs/pashto-inflector";
import { useState } from "react";
import { isFemNounEntry, isPattern1Entry, isPattern2Entry, isPattern3Entry, isPattern4Entry, isPattern5Entry, isPattern6FemEntry } from "../../lib/type-predicates";

const filterOptions = [
    {
        label: "1",
        value: "1",
    },
    {
        label: "2",
        value: "2",
    },
    {
        label: "3",
        value: "3",
    },
    {
        label: "4",
        value: "4",
    },
    {
        label: "5",
        value: "5",
    },
    {
        label: "6",
        value: "6",
    },
];

type FilterPattern = "1" | "2" | "3" | "4" | "5" | "6";

function nounFilter(p: FilterPattern | undefined) {
    return p === undefined
        ? () => true
        : (p === "1")
        ? isPattern1Entry
        : (p === "2")
        ? isPattern2Entry
        : (p === "3")
        ? isPattern3Entry
        : (p === "4")
        ? isPattern4Entry
        : (p === "5")
        ? isPattern5Entry
        : (p === "6")
        ? (n: NounEntry) => (isFemNounEntry(n) && isPattern6FemEntry(n))
        : () => true;
}

function NPNounPicker({ onChange, noun, nouns, clearButton }: { nouns: NounEntry[], noun: NounSelection | undefined, onChange: (p: NounSelection) => void, clearButton?: JSX.Element }) {
    const [patternFilter, setPatternFilter] = useState<FilterPattern | undefined>(undefined);
    const [showFilter, setShowFilter] = useState<boolean>(false)
    const options = nouns
        .filter(nounFilter(patternFilter))
        .sort((a, b) => (a.p.localeCompare(b.p, "af-PS")))
        .map(makeSelectOption);
    function onEntrySelect({ value }: { label: string, value: string }) {
        const entry = nouns.find(n => n.ts.toString() === value);
        if (!entry) {
            console.error("entry not found");
            return;
        }
        onChange(makeNounSelection(entry));
    }
    function handleFilterClose() {
        setPatternFilter(undefined);
        setShowFilter(false);
    }
    return <div style={{ maxWidth: "225px", minWidth: "125px" }}>
        <div className="d-flex flex-row justify-content-between">
            {clearButton}
            {(!showFilter && !(noun?.dynamicComplement))  && <div className="text-right">
                <button className="btn btn-sm btn-light mb-2 text-small" onClick={() => setShowFilter(true)}>
                    <i className="fas fa-filter fa-xs" />
                </button>
            </div>}
        </div>
        {showFilter && <div className="mb-2 text-center">
            <div className="d-flex flex-row justify-content-between">
                <div className="text-small mb-1">Filter by inflection pattern</div>
                <div className="clickable" onClick={handleFilterClose}>X</div>
            </div>
            <ButtonSelect
                options={filterOptions}
                // @ts-ignore
                value={patternFilter}
                // @ts-ignore
                handleChange={setPatternFilter}
            />
        </div>}
        {!(noun && noun.dynamicComplement) ? <div>
            <Select
                value={noun && noun.entry.ts.toString()}
                // @ts-ignore
                onChange={onEntrySelect}
                className="mb-2"
                // @ts-ignore
                options={options}
                isSearchable
                // @ts-ignore
                placeholder={noun ? options.find(o => o.value === (noun.entry).ts.toString())?.label : "Select Noun..."}
                {...zIndexProps}
            />
        </div> : <div>
            {noun && <div>
                <div className="mb-2">Included in Dyn. Compound:</div>
                <div className="mb-3 text-center">
                    <InlinePs opts={opts}>
                        {{ p: noun.entry.p, f: noun.entry.f }}
                    </InlinePs>
                    <div className="text-muted">{noun.entry.e}</div>
                </div>
            </div>}
        </div>}
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