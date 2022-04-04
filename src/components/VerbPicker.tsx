import Select from "react-select";
import {
    makeNounSelection,
    zIndexProps,
} from "./np-picker/picker-tools";
import {
    Types as T,
    ButtonSelect,
    getVerbInfo,
} from "@lingdocs/pashto-inflector";
import { isPerfectTense } from "../lib/phrase-building/vp-tools";
import EntrySelect from "./EntrySelect";
// import { useState } from "react";

const tenseOptions: { label: string | JSX.Element, value: VerbTense }[] = [{
    label: <div><i className="fas fa-video mr-2" />present</div>,
    value: "presentVerb",
}, {
    label: <div><i className="fas fa-camera mr-2" />subjunctive</div>,
    value: "subjunctiveVerb",
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

const perfectTenseOptions: { label: string | JSX.Element, value: PerfectTense }[] = [{
    label: "Present Perfect",
    value: "present perfect",
}, {
    label: "Habitual Perfect",
    value: "habitual perfect",
}, {
    label: "Subjunctive Perfect",
    value: "subjunctive perfect",
}, {
    label: "Future Perfect",
    value: "future perfect",
}, {
    label: "Past Perfect",
    value: "past perfect",
}, {
    label: `"Would Be" Perfect`,
    value: "wouldBe perfect",
}, {
    label: "Past Subjunctive Perfect",
    value: "pastSubjunctive perfect",
}];

// type Filters = {
//     stative: boolean,
//     dynamic: boolean,
//     transitive: boolean,
//     intransitive: boolean,
//     grammaticallyTransitive: boolean,
// }

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
    function onTenseSelect(o: { value: VerbTense | PerfectTense } | null) {
        const value = o?.value ? o.value : undefined; 
        if (verb && value) {
            if (isPerfectTense(value)) {
                onChange({
                    ...verb,
                    tense: value,
                    tenseCategory: "perfect",
                });
            } else {
                onChange({
                    ...verb,
                    tense: value,
                    tenseCategory: verb.tenseCategory === "perfect" ? "basic" : verb.tenseCategory,
                });
            }
        }
    }
    function moveTense(dir: "forward" | "back") {
        if (!verb) return;
        return () => {
            const tenses = verb.tenseCategory === "perfect" ? perfectTenseOptions : tenseOptions;
            const currIndex = tenses.findIndex(tn => tn.value === verb.tense)
            if (currIndex === -1) {
                console.error("error moving tense", dir);
                return;
            }
            const newIndex = dir === "forward"
                ? ((currIndex + 1) % tenses.length)
                : (currIndex === 0 ? (tenses.length - 1) : (currIndex - 1))
            const newTense = tenses[newIndex];
            onTenseSelect(newTense);
        };
    }
    function onPosNegSelect(value: string) {
        if (verb) {
            onChange({
                ...verb,
                negative: value === "true",
            });
        }
    }
    function onTenseCategorySelect(value: "basic" | "modal" | "perfect") {
        if (verb) {
            if (value === "perfect") {
                onChange({
                    ...verb,
                    tenseCategory: value,
                    tense: isPerfectTense(verb.tense) ? verb.tense : "present perfect",
                });
            } else {
                onChange({
                    ...verb,
                    tenseCategory: value,
                    tense: isPerfectTense(verb.tense) ? "presentVerb" : verb.tense,
                });
            }
        }
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
    const tOptions = (verb?.tenseCategory === "perfect") ? perfectTenseOptions : tenseOptions;
    return <div style={{ maxWidth: "225px", minWidth: "175px" }}>
        <div>Verb:</div>
        <EntrySelect
            entries={verbs}
            value={verb?.verb}
            onChange={onVerbSelect}
            name="Verb"
            isVerbSelect
        />
        {/* <Select
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
        /> */}
        {verb && verb.changeTransitivity && <div className="text-center mt-3">
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
        {verb && <div className="col text-center my-3">
            <ButtonSelect
                small
                value={verb.tenseCategory}
                options={[{
                    label: "Basic",
                    value: "basic",
                }, {
                    label: "Perfect",
                    value: "perfect",
                }, {
                    label: "Modal",
                    value: "modal",
                }]}
                handleChange={onTenseCategorySelect}
            />
        </div>}
        {verb && verb.changeVoice && <div className="col text-center my-3">
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
        <div>Tense:</div>
        <Select
            isSearchable={false}
            // for some reason can't use tOptions with find here;
            value={verb && ([...tenseOptions, ...perfectTenseOptions].find(o => o.value === verb.tense))}
            onChange={onTenseSelect}
            className="mb-2"
            options={tOptions}
            {...zIndexProps}
        />
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
        {verb && <div className="d-flex flex-row justify-content-between align-items-center my-3" style={{ width: "100%" }}>
            <div onClick={moveTense("back")} className="clickable">
                <i className="fas fa-chevron-left" />
            </div>
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
            <div onClick={moveTense("forward")} className="clickable">
                <i className="fas fa-chevron-right" />
            </div>
        </div>}
    </div>;
}

function makeVerbSelection(verb: VerbEntry, changeSubject: (s: NPSelection | undefined) => void, oldVerbSelection?: VerbSelection): VerbSelection {
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
        : (info.type === "dynamic compound" && oldVerbSelection?.voice !== "passive")
            ? makeNounSelection(info.objComplement.entry as NounEntry, true)
            : (transitivity === "transitive" && oldVerbSelection?.voice !== "passive")
                ? getTransObjFromOldVerbSelection()
                : "none";
    if (oldVerbSelection?.voice === "passive" && info.type === "dynamic compound") {
        changeSubject(makeNounSelection(info.objComplement.entry as NounEntry, true));
    }
    const isCompound = ("stative" in info || info.type === "stative compound")
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
    const tenseSelection = ((): { tenseCategory: "perfect", tense: PerfectTense } | {
        tenseCategory: "basic" | "modal",
        tense: VerbTense,
    } => {
        if (!oldVerbSelection) {
            return { tense: "presentVerb", tenseCategory: "basic" };
        }
        if (oldVerbSelection.tenseCategory === "modal") {
            return { tenseCategory: "modal", tense: isPerfectTense(oldVerbSelection.tense) ? "presentVerb" : oldVerbSelection.tense };
        }
        if (oldVerbSelection.tenseCategory === "basic") {
            return { tenseCategory: "basic", tense: isPerfectTense(oldVerbSelection.tense) ? "presentVerb" : oldVerbSelection.tense };
        }
        return { tenseCategory: "perfect", tense: isPerfectTense(oldVerbSelection.tense) ? oldVerbSelection.tense : "present perfect" };
    })();
    return {
        type: "verb",
        verb: verb,
        dynAuxVerb,
        ...tenseSelection,
        object,
        transitivity,
        isCompound,
        voice: transitivity === "transitive"
            ? (oldVerbSelection?.voice || "active")
            : "active",
        negative: oldVerbSelection ? oldVerbSelection.negative : false,
        ...("grammaticallyTransitive" in info) ? {
            changeTransitivity: function(t) {
                return {
                    ...this,
                    transitivity: t,
                    object: t === "grammatically transitive" ? T.Person.ThirdPlurMale : undefined,
                };
            },
        } : {},
        ...("stative" in info) ? {
            changeStatDyn: function(c) {
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
        ...(transitivity === "transitive") ? {
            changeVoice: function(v, s) {
                return {
                    ...this,
                    voice: v,
                    object: v === "active" ? s : "none",
                };
            },
        } : {},
    };
}

export default VerbPicker;