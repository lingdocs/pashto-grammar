import Select from "react-select";
import {
    makeVerbSelectOption,
    zIndexProps,
} from "./np-picker/picker-tools";
import {
    Types as T,
    ButtonSelect,
} from "@lingdocs/pashto-inflector";

const tenseOptions: { label: string, value: VerbTense }[] = [{
    label: "present",
    value: "present",
}, {
    label: "subjunctive",
    value: "subjunctive",
}, {
    label: "imperf. future",
    value: "imperfectiveFuture",
}, {
    label: "perf. future",
    value: "perfectiveFuture",
}, {
    label: "simple past",
    value: "perfectivePast",
}, {
    label: "continuous past",
    value: "imperfectivePast",
}];

function makeVerbSelection(verb: VerbEntry, oldVerbSelection?: VerbSelection): VerbSelection {
    function getTransObjFromOldVerbSelection() {
        if (!oldVerbSelection || oldVerbSelection.object === "none" || typeof oldVerbSelection.object === "number") return undefined;
        return oldVerbSelection.object;
    }
    // TODO: more complex types and unchangeable dynamic compound objects
    // TODO: use proper type predicates
    const transitivity: "intransitive" | "transitive" | "grammaticallyTransitive" = verb.entry.c?.includes("intrans.")
        ? "intransitive"
        : verb.entry.c?.includes("v. gramm. trans.")
        ? "grammaticallyTransitive"
        : "transitive";
    const object = (transitivity === "grammaticallyTransitive")
        ? T.Person.ThirdPlurMale
        : transitivity === "transitive"
        ? getTransObjFromOldVerbSelection()
        : "none";
    // TODO: better here based on selection of which type
    const isCompound = verb.entry.c?.includes("stat. comp.")
        ? "stative"
        : verb.entry.c?.includes("dyn. comp.")
        ? "dynamic"
        : false;
    return {
        type: "verb",
        verb,
        tense: oldVerbSelection ? oldVerbSelection.tense : "present",
        object,
        transitivity,
        isCompound,
        negative: oldVerbSelection ? oldVerbSelection.negative : false,
        ...verb.entry.c?.includes("v. trans./gramm. trans") ? {
            changeTransitivity: function (t) {
                return {
                    ...this,
                    transitivity: t,
                    object: t === "grammaticallyTransitive" ? T.Person.ThirdPlurMale : undefined,
                };
            },
        } : {},
    };
}

function VerbPicker({ onChange, verb, verbs }: { verbs: VerbEntry[], verb: VerbSelection | undefined, onChange: (p: VerbSelection) => void }) {
    const options = verbs.sort((a, b) => (a.entry.p.localeCompare(b.entry.p, "af-PS"))).map(makeVerbSelectOption);
    function onEntrySelect({ value }: { label: string, value: string }) {
        const v = verbs.find(v => v.entry.ts.toString() === value);
        if (!v) {
            console.error("entry not found");
            return;
        }
        onChange(makeVerbSelection(v, verb));
    }
    function onTenseSelect({ value }: { label: string, value: VerbTense }) {
        if (verb) {
            onChange({
                ...verb,
                tense: value,
            });
        }
    }
    function onPosNegSelect(value: string) {
        if (verb) {
            onChange({
                ...verb,
                negative: value === "true", 
            });
        }
    }
    function notInstransitive(t: "transitive" | "intransitive" | "grammaticallyTransitive"): "transitive" | "grammaticallyTransitive" {
        return t === "intransitive" ? "transitive" : t;
    }
    function handleChangeTransitivity(t: "transitive" | "grammaticallyTransitive") {
        if (verb && verb.changeTransitivity) {
            onChange(verb.changeTransitivity(t));
        }
    } 
    return <div style={{ maxWidth: "225px", minWidth: "125px" }}>
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
            isSearchable={false}
            value={verb && verb.tense}
            // @ts-ignore
            onChange={onTenseSelect}
            className="mb-2"
            // @ts-ignore
            options={tenseOptions}
            placeholder={verb ? tenseOptions.find(o => o.value === verb.tense)?.label : "Select Tense..."}
            {...zIndexProps}
        />
        {verb && <div className="text-center my-3">
            <ButtonSelect
                small
                value={verb.negative.toString()}
                options={[{
                    label: "Pos.",
                    value: "false",
                }, {
                    label: "Neg.",
                    value: "true",
                }]}
                handleChange={onPosNegSelect}
            />
        </div>}
        {verb && verb.changeTransitivity && <div className="text-center">
            <ButtonSelect
                small
                options={[{
                    label: "gramm. trans.",
                    value: "grammaticallyTransitive",
                }, {
                    label: "trans.",
                    value: "transitive",
                }]}
                value={notInstransitive(verb.transitivity)}
                handleChange={handleChangeTransitivity}
            />
        </div>}
    </div>;
}

export default VerbPicker;