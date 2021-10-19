import React, { useState } from "react";
import {
    Types as T,
    defaultTextOptions as opts,
    VerbTable,
    removeFVarients,
    getEnglishWord,
} from "@lingdocs/pashto-inflector";
import {
    isUnisexNoun,
} from "../lib/type-predicates";
import {
    equativeMachine,
    assembleEquativeOutput,
} from "../lib/equative-machine";
import { nouns, adjectives } from "../words/words";

function uniqueSort(arr: Adjective[]): Adjective[];
function uniqueSort(arr: UnisexNoun[]): UnisexNoun[];
function uniqueSort(arr: (Adjective | UnisexNoun)[]): (Adjective | UnisexNoun)[] {
    return arr
        .filter((e) => {
            try {
                for (let p = 0; p < 12; p++) {
                    equativeMachine(p, e);
                }
            } catch (err) {
                console.error("equative generation failed", e);
                console.error(err);
                return false;
            }
            return true;
        })
        .sort((a, b) => a.p.localeCompare(b.p));
}

const unisexNouns = nouns.filter(x => isUnisexNoun(x)) as UnisexNoun[];

const inputs = {
    // TODO: instead - have them unique and sorted in the words.ts file
    adjectives: uniqueSort(adjectives),
    unisexNouns: unisexNouns.sort((a, b) => a.p.localeCompare(b.p)),
};

function makeBlock(e: Adjective | UnisexNoun): T.VerbBlock {
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
// type SubjectType = "pronouns" | "nouns";

// TODO: Plural nouns like shoode
const defaultTs = 1527815306;
// const defaultPe = inputs.adjectives.find(a => a.ts === defaultTs) || inputs.adjectives[0];

function EquativeExplorer() {
    // TODO: Use sticky state
    const predicateTypes: PredicateType[] = ["adjectives", "unisexNouns"];
    // const subjectTypes: SubjectType[] = ["pronouns", "nouns"];
    const [predicate, setPredicate] = useState<number>(defaultTs);
    // const [subjectType, setSubjectType] = useState<SubjectType>("pronouns");
    const [predicateType, setPredicateType] = useState<PredicateType>("adjectives");
    
    function makeOptionLabel(e: T.DictionaryEntry): string {
        const eng = getEnglishWord(e);
        const english = typeof eng === "string" ? eng : eng?.singular; 
        return `${e.p} - ${removeFVarients(e.f)} (${english})`;
    }
    function handlePredicateSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        setPredicate(parseInt(e.target.value));
    }
    function handlePredicateTypeSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const pt = e.target.value as PredicateType;
        setPredicateType(pt);
        setPredicate(inputs[pt][0].ts);
    }
    // function handleSubjectTypeSelect(e: React.ChangeEvent<HTMLInputElement>) {
    //     const st = e.target.value as SubjectType;
    //     setSubjectType(st);
    //     // setPredicate(inputs[pt][0].ts);
    // }
    const predicatePile = inputs[predicateType] as T.DictionaryEntry[];
    const pe = predicatePile.find(p => p.ts === predicate) as UnisexNoun | Adjective;
    if (!pe) return <>
        ERROR!
    </>
    console.log("predicate in use", pe);
    return <>
        <div className="d-flex flex-row">
            {/* <div className="form-group">
                <label htmlFor="subject-select"><strong>Subject:</strong></label>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="pronounsSubjectRadio"
                        id="pronounsSubjectRadio"
                        value={subjectTypes[0]}
                        checked={subjectType === "pronouns"}
                        onChange={handleSubjectTypeSelect}
                    />
                    <label className="form-check-label" htmlFor="pronounsSubjectRadio">
                        Pronouns
                    </label>
                </div>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="nounsSubjectRadio"
                        id="nounsSubjectRadio"
                        value={subjectTypes[0]}
                        checked={subjectType === "nouns"}
                        onChange={handleSubjectTypeSelect}
                    />
                    <label className="form-check-label" htmlFor="nounsSubjectRadio">
                        Nouns
                    </label>
                </div>
            </div> */}
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
                {/* hiding this because it's a bit buggy still */}
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
                    {inputs[predicateType].map((e: Adjective | UnisexNoun) => (
                        <option key={e.ts+"s"} value={e.ts}>{makeOptionLabel(e)}</option>
                    ))}
                </select>
            </div>
        </div>
        <VerbTable textOptions={opts} block={makeBlock(pe)} />
    </>;
}

export default EquativeExplorer;