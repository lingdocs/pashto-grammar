import {
    VerbTable,
    defaultTextOptions as opts,
    ButtonSelect,
    Types as T,
    personGender,
    personIsPlural,
} from "@lingdocs/pashto-inflector";
import {
    ExplorerState,
    ExplorerReducerAction,
} from "./explorer-types";
// import {
//     makeBlockWPronouns,
// } from "./explorer-helpers";
import {
    equativeMachine,
    assembleEquativeOutput,
} from "../../lib/equative-machine";
import {
    isPluralNounEntry,
    isUnisexNounEntry,
    isAdjectiveEntry,
    isSingularEntry,
    isVerbEntry,
    isLocativeAdverbEntry,
    isNounEntry,
} from "../../lib/type-predicates";

function chooseLength<O>(o: T.SingleOrLengthOpts<O>, length: "short" | "long"): O {
    return ("long" in o) ? o[length] : o;
}

function SingleItemDisplay({ state }: { state: ExplorerState }) {
    if (state.subject.type === "pronouns") {
        return <div>ERROR: Wrong display being used</div>;
    }
    try {
        const se = state.subject[state.subject.type];
        const pe = state.predicate[state.predicate.type];
        const subject = makeNounPhrase(se, state, "subject");
        const predicate = (isAdjectiveEntry(pe) || isLocativeAdverbEntry(pe)) 
            ? makeComplement(pe)
            : makeNounPhrase(pe, state, "predicate");
        const block = assembleEquativeOutput(
            equativeMachine({
                subject,
                predicate,
                tense: state.tense,
            })
        );
        return <div>
            <VerbTable textOptions={opts} block={chooseLength(block, state.length)} />
        </div>;
    } catch (e) {
        console.error(e);
        return <div>Error making equative sentence</div>
    }
}

function makeComplement(entry: AdjectiveEntry | LocativeAdverbEntry): Compliment {
    return {
        type: "compliment",
        entry,
    };
}

function makeNounPhrase(entry: NounEntry | UnisexNounEntry | VerbEntry, state: ExplorerState, entity: "subject" | "predicate"): NounPhrase {
    if (isVerbEntry(entry)) {
        return {
            type: "participle",
            entry,
        };
    }
    const isUnisex = isUnisexNounEntry(entry);
    if (isUnisex && isSingularEntry(entry)) {
        return {
            type: "unisex noun",
            number: state[entity].info.number,
            gender: state[entity].info.gender,
            entry,
        };
    }
    if (isUnisex && isPluralNounEntry(entry)) {
        return {
            type: "unisex noun",
            number: state[entity].info.number,
            gender: state[entity].info.gender,
            entry,
        };
    }
    if (isUnisex) {
        throw new Error("improper unisex noun");
    }
    if (isPluralNounEntry(entry)) {
        const e = entry as PluralNounEntry<MascNounEntry | FemNounEntry>;
        return {
            type: "plural noun",
            entry: e,
        };
    }
    if (isSingularEntry(entry)) {
        const e = entry as SingularEntry<MascNounEntry | FemNounEntry>;
        return {
            type: "singular noun",
            entry: e,
            number: state[entity].info.number,
        };
    }
    throw new Error("unable to make subject input from entry");
}

export function makeBlockWPronouns(e: AdjectiveEntry | UnisexNounEntry | LocativeAdverbEntry, tense: EquativeTense, length?: "short" | "long"): T.SingleOrLengthOpts<T.VerbBlock> {
    // if the output's gonna have long / short forms (if it's past or wouldBe) then recursive call to make the long and short versions
    if (!length && "long" in assembleEquativeOutput(equativeMachine({
        subject: { type: "pronoun", pronounType: "near", person: 0 },
        predicate: (isAdjectiveEntry(e) || isLocativeAdverbEntry(e))
            ? { type: "compliment", entry: e }
            : { type: "unisex noun", gender: "masc", number: "singular", entry: e },
        tense,
    }))) {
        return {
            short: makeBlockWPronouns(e, tense, "short") as T.VerbBlock,
            long: makeBlockWPronouns(e, tense, "long") as T.VerbBlock,
        };
    }
    const makeP = (p: T.Person): T.ArrayOneOrMore<T.PsString> => {
        const b = assembleEquativeOutput(equativeMachine({
            subject: { type: "pronoun", pronounType: "far", person: p },
            predicate: (isAdjectiveEntry(e) || isLocativeAdverbEntry(e))
                ? { type: "compliment", entry: e }
                : { type: "unisex noun", gender: personGender(p), number: personIsPlural(p) ? "plural" : "singular", entry: e },
            tense,
        }));
        if ("long" in b) {
            if (!length) throw new Error("bad length processing");
            return b[length];
        }    
        return b;
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

function PronounBlockDisplay({ state }: { state: ExplorerState }) {
    const pred = state.predicate[state.predicate.type];
    if (!isVerbEntry(pred) && (isAdjectiveEntry(pred) || isLocativeAdverbEntry(pred) || (isNounEntry(pred) && isUnisexNounEntry(pred)))) {
        const block = makeBlockWPronouns(pred, state.tense);
        return <VerbTable
            textOptions={opts}
            block={chooseLength(block, state.length)}
        />;
    }
    return <div>Invalid combination</div>
}

function EquativeDisplay({ state, dispatch }: { state: ExplorerState, dispatch: (action: ExplorerReducerAction) => void }) {
    return <>
        {(state.tense === "past" || state.tense === "wouldBe") && <div className="text-center">
            <ButtonSelect
                small
                options={[
                    { label: "Long", value: "long" },
                    { label: "Short", value: "short" },
                ]}
                value={state.length}
                handleChange={(p) => dispatch({ type: "setLength", payload: p as "long" | "short" })}
            />
        </div>}
        {state.subject.type === "pronouns" 
            ? <PronounBlockDisplay state={state} />
            : <SingleItemDisplay state={state} />
        }
        {state.predicate.type === "participle" && <div className="mt-2 small text-muted text-center">
            Note: This means that the subject <em>is</em> the act of the participle/verb, not that the subject is currently doing the verb!
        </div>}
    </>;
}

export default EquativeDisplay;
