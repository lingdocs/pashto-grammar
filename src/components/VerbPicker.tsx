import Select from "react-select";
import {
    makeNounSelection,
    makeVerbSelectOption,
    zIndexProps,
} from "./np-picker/picker-tools";
import {
    Types as T,
    ButtonSelect,
    getVerbInfo,
} from "@lingdocs/pashto-inflector";
// import { useState } from "react";

const tenseOptions: { label: string | JSX.Element, value: VerbTense }[] = [{
    label: <div><i className="fas fa-video mr-2" />present</div>,
    value: "present",
}, {
    label: <div><i className="fas fa-camera mr-2" />subjunctive</div>,
    value: "subjunctive",
}, {
    label: <div><i className="fas fa-video mr-2" />imperf. future</div>,
    value: "imperfectiveFuture",
}, {
    label: <div><i className="fas fa-camera mr-2" />perf. future</div>,
    value: "perfectiveFuture",
}, {
    label: <div><i className="fas fa-video mr-2" />continuous past</div>,
    value: "imperfectivePast",
}, {
    label: <div><i className="fas fa-camera mr-2" />simple past</div>,
    value: "perfectivePast",
}, {
    label: <div><i className="fas fa-video mr-2" />habitual cont. past.</div>,
    value: "habitualImperfectivePast",
}, {
    label: <div><i className="fas fa-camera mr-2" />habitual simp. past.</div>,
    value: "habitualPerfectivePast",
}];

// type Filters = {
//     stative: boolean,
//     dynamic: boolean,
//     transitive: boolean,
//     intransitive: boolean,
//     grammaticallyTransitive: boolean,
// }

function VerbPicker({ onChange, verb, verbs }: { verbs: VerbEntry[], verb: VerbSelection | undefined, onChange: (p: VerbSelection) => void }) {
    // const [filters, useFilters] = useState<Filters>({
    //     stative: true,
    //     dynamic: true,
    //     transitive: true,
    //     intransitive: true,
    //     grammaticallyTransitive: true,
    // });
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
    function onTenseCategorySelect(value: "basic" | "modal") {
        if (verb) {
            onChange({
                ...verb,
                tenseCategory: value,
            });
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
    return <div style={{ maxWidth: "225px", minWidth: "175px" }}>
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
        {verb && <div className="text-center my-3">
            <ButtonSelect
                small
                value={verb.tenseCategory}
                options={[{
                    label: "Basic",
                    value: "basic",
                }, {
                    label: "Modal",
                    value: "modal",
                }]}
                handleChange={onTenseCategorySelect}
            />
        </div>}
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
                    value: "grammatically transitive",
                }, {
                    label: "trans.",
                    value: "transitive",
                }]}
                value={notInstransitive(verb.transitivity)}
                handleChange={handleChangeTransitivity}
            />
        </div>}
        {verb && verb.changeStatDyn && <div className="text-center">
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
    </div>;
}

function makeVerbSelection(verb: VerbEntry, oldVerbSelection?: VerbSelection): VerbSelection {
    const info = getVerbInfo(verb.entry, verb.complement);
    function getTransObjFromOldVerbSelection() {
        if (
            !oldVerbSelection ||
            oldVerbSelection.object === "none" ||
            typeof oldVerbSelection.object === "number" ||
            oldVerbSelection.isCompound === "dynamic" ||
            (oldVerbSelection.object?.type === "noun" && oldVerbSelection.object.dynamicComplement)
        ) return undefined;
        return oldVerbSelection.object;
    }
    const transitivity: T.Transitivity = "grammaticallyTransitive" in info
        ? "transitive"
        : info.transitivity;
    const object = (transitivity === "grammatically transitive")
        ? T.Person.ThirdPlurMale
        : info.type === "dynamic compound"
            ? makeNounSelection(info.objComplement.entry as NounEntry, true)
            : (transitivity === "transitive")
                ? getTransObjFromOldVerbSelection()
                : "none";
    const isCompound = "stative" in info
        ? "stative"
        : info.type === "dynamic compound"
            ? "dynamic"
            : false;
    // TODO: here and below in the changeStatDyn function ... allow for entries with complement
    const dynAuxVerb: VerbEntry | undefined = isCompound !== "dynamic"
        ? undefined
        : info.type === "dynamic compound"
            ? { entry: info.auxVerb } as VerbEntry
            : "dynamic" in info
                ? { entry: info.dynamic.auxVerb } as VerbEntry
                : undefined;
    return {
        type: "verb",
        verb: verb,
        dynAuxVerb,
        tense: oldVerbSelection ? oldVerbSelection.tense : "present",
        object,
        transitivity,
        isCompound,
        tenseCategory: oldVerbSelection ? oldVerbSelection.tenseCategory : "basic",
        negative: oldVerbSelection ? oldVerbSelection.negative : false,
        ...("grammaticallyTransitive" in info) ? {
            changeTransitivity: function (t) {
                return {
                    ...this,
                    transitivity: t,
                    object: t === "grammatically transitive" ? T.Person.ThirdPlurMale : undefined,
                };
            },
        } : {},
        ...("stative" in info) ? {
            changeStatDyn: function (c) {
                return {
                    ...this,
                    isCompound: c,
                    object: c === "dynamic"
                        ? makeNounSelection(info.dynamic.objComplement.entry as NounEntry, true)
                        : undefined,
                    dynAuxVerb: c === "dynamic"
                        ? { entry: info.dynamic.auxVerb } as VerbEntry
                        : undefined,
                };
            }
        } : {},
    };
}

export default VerbPicker;