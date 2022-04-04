import {
    makeNounSelection,
} from "../np-picker/picker-tools";
import {
    getVerbInfo,
    Types as T,
} from "@lingdocs/pashto-inflector";
import { isPerfectTense } from "../../lib/phrase-building/vp-tools";

export function makeVerbSelection(verb: VerbEntry, changeSubject: (s: NPSelection | undefined) => void, oldVerbSelection?: VerbSelection): VerbSelection {
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
