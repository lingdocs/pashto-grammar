import React, { useState } from "react";
import {
    Types as T,
    defaultTextOptions as opts,
    VerbTable,
    removeFVarients,
} from "@lingdocs/pashto-inflector";
import {
    equativeMachine,
    assembleEquativeOutput,
    AdjectiveInput,
    PredicateInput,
    isAdjectiveInput,
    EntityInput,
    isUnisexNounInput,
    UnisexNounInput,
} from "../lib/equative-machine";
import words from "../words/nouns-adjs";

const inputs = {
    adjectives: words.filter((w) => isAdjectiveInput(w.entry as EntityInput))
        .map((w) => w.entry as AdjectiveInput),
    unisexNouns: words.filter((w) => isUnisexNounInput(w.entry as EntityInput))
        .map((w) => w.entry as UnisexNounInput),
};

function makeBlock(e: PredicateInput): T.VerbBlock {
    const makeP = (p: T.Person): T.ArrayOneOrMore<T.PsString> => {
        const b = assembleEquativeOutput(equativeMachine(p, e));
        return ("long" in b ? b.long : b) as T.ArrayOneOrMore<T.PsString>;
    };
    return [
        [makeP(0), makeP(6)],
        [makeP(1), makeP(7)],
        [makeP(2), makeP(8)],
        [makeP(3), makeP(9)],
        [makeP(4), makeP(10)],
        [makeP(5), makeP(11)],
    ];
}

type PredicateType = "adjectives" | "unisexNouns";

function EquativeExplorer() {
    // TODO: Use sticky state
    const predicateTypes: PredicateType[] = ["adjectives", "unisexNouns"]; 
    const [predicate, setPredicate] = useState<number>(1527815306);
    const [predicateType, setPredicateType] = useState<PredicateType>("adjectives");
    function handlePredicateSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        setPredicate(parseInt(e.target.value));
    }
    function handlePredicateTypeSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const pt = e.target.value as PredicateType;
        setPredicateType(pt);
        setPredicate(inputs[pt][0].ts);
    }
    // @ts-ignore
    const pe = (inputs[predicateType].find((a: AdjectiveInput | UnisexNounInput) => (
        a.ts === predicate
    ))) as PredicateInput;
    console.log("pe is", pe);
    const block = makeBlock(pe);

    return <>
        <div className="form-group">
            <label htmlFor="predicate-select"><strong>Predicate:</strong></label>
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="radio"
                    name="adjectivesPredicateRadio"
                    id="adjectivesPredicateRadio"
                    value={predicateTypes[0]}
                    checked={predicateType === "adjectives"}
                    onChange={handlePredicateTypeSelect}
                />
                <label className="form-check-label" htmlFor="adjectivesPredicateRadio">
                    Adjectives
                </label>
            </div>
            <div className="form-check mb-2">
                <input
                    className="form-check-input"
                    type="radio"
                    name="unisexNounsPredicateRadio"
                    id="unisexNounsPredicateRadio"
                    value={predicateTypes[1]}
                    checked={predicateType === "unisexNouns"}
                    onChange={handlePredicateTypeSelect}
                />
                <label className="form-check-label" htmlFor="unisexNounsPredicateRadio">
                    Unisex Nouns
                </label>
            </div>
            <select
                className="form-control"
                id="predicate-select"
                value={predicate}
                onChange={handlePredicateSelect}
            >
                {inputs[predicateType].map((e: AdjectiveInput | UnisexNounInput) => (
                    <option key={e.ts+"s"} value={e.ts}>{e.p} - {removeFVarients(e.f)}</option>
                ))}
            </select>
        </div>
        <VerbTable textOptions={opts} block={block} />
    </>;
}

export default EquativeExplorer;