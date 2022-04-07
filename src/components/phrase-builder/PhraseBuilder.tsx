import { useState } from "react";
import NPPicker from "../np-picker/NPPicker";
import VerbPicker from "../VerbPicker";
import TensePicker from "../TensePicker";
import VPDisplay from "./VPDisplay";
import { verbs } from "../../words/words";
import { renderVP } from "../../lib/phrase-building";
import {
    isInvalidSubjObjCombo,
} from "../../lib/np-tools";
import {
    ButtonSelect,
    defaultTextOptions,
    Types as T,
} from "@lingdocs/pashto-inflector";
import ChartDisplay from "./ChartDisplay";
import useStickyState from "../../useStickyState";
import { makeVerbSelection } from "./verb-selection";

const kingEmoji = "👑";
const servantEmoji = "🙇‍♂️";

// TODO: Drill Down text display options

// TODO: SHOW KING AND SERVANT ONCE TENSE PICKED, EVEN IF NPs not selected
// TODO: Issue with dynamic compounds english making with plurals
// TODO: Issue with "the money were taken"
// TODO: Use the same component for PronounPicker and NPPronounPicker (sizing issue)
// get the practice pronoun picker page into a typesafe file
// A little button you can press on the tense select to show the formula and info about the tense
// in a popup
// TODO: option to show 3 modes  Phrases - Charts - Quiz

// TODO: error handling on error with rendering etc
export function PhraseBuilder(props: {
    verb?: VerbEntry,
    opts?: T.TextOptions,
}) {
    const [subject, setSubject] = useStickyState<NPSelection | undefined>(undefined, "subjectNPSelection");
    const [mode, setMode] = useStickyState<"charts" | "phrases">("phrases", "verbExplorerMode");
    const [verb, setVerb] = useState<VerbSelection | undefined>(
        props.verb ? makeVerbSelection(props.verb, setSubject, undefined) : undefined,
    );
    const textOpts = props.opts || defaultTextOptions;
    function handleSubjectChange(subject: NPSelection | undefined, skipPronounConflictCheck?: boolean) {
        if (!skipPronounConflictCheck && hasPronounConflict(subject, verb?.object)) {
            alert("That combination of pronouns is not allowed");
            return;
        }
        setSubject(subject);
    }
    function handleObjectChange(object: NPSelection | undefined) {
        if (!verb) return;
        if ((verb.object === "none") || (typeof verb.object === "number")) return;
        // check for pronoun conflict
        if (hasPronounConflict(subject, object)) {
            alert("That combination of pronouns is not allowed");
            return;
        }
        setVerb({ ...verb, object });
    }
    function handleSubjObjSwap() {
        if (verb?.isCompound === "dynamic") return;
        const output = switchSubjObj({ subject, verb });
        setSubject(output.subject);
        setVerb(output.verb);
    }
    const verbPhrase: VPSelection | undefined = verbPhraseComplete({ subject, verb });
    const VPRendered = verbPhrase && renderVP(verbPhrase);
    return <div className="mt-3" style={{ maxWidth: "950px"}}>
        <div className="mb-3">
            <div>{kingEmoji} = <abbr title="controls the verb conjugation, can be removed">king</abbr> of phrase</div>
            <div>{servantEmoji} = <abbr title="can be shrunken into a mini-pronoun">servant</abbr> of phrase</div>
        </div>
        <VerbPicker
            verbLocked={!!props.verb}
            verbs={verbs}
            verb={verb}
            subject={subject}
            changeSubject={(s) => handleSubjectChange(s, true)}
            onChange={setVerb}
            opts={textOpts}
        />
        <div className="text-right mb-2">
            <ButtonSelect
                value={mode}
                options={[
                    { label: "Charts", value: "charts" },
                    { label: "Phrases", value: "phrases" },
                ]}
                handleChange={setMode}
            />
        </div>
        {(verb && (typeof verb.object === "object") && (verb.isCompound !== "dynamic") && (mode !== "charts")) &&
            <div className="text-center mt-4">
                <button onClick={handleSubjObjSwap} className="btn btn-sm btn-light">
                    <i className="fas fa-exchange-alt mr-2" /> subj/obj
                </button>
            </div>}
        <div className="d-flex flex-row justify-content-around flex-wrap" style={{ marginLeft: "-0.5rem", marginRight: "-0.5rem" }}>
            {mode !== "charts" && <>
                <div className="my-2">
                    <div className="h5 text-center">Subject {showRole(VPRendered, "subject")}</div>
                    <NPPicker
                        np={subject}
                        counterPart={verb ? verb.object : undefined}
                        onChange={handleSubjectChange}
                        opts={textOpts}
                    />
                </div>
                {verb && (verb.object !== "none") && <div className="my-2">
                    <div className="h5 text-center">Object {showRole(VPRendered, "object")}</div>
                    {(typeof verb.object === "number")
                        ? <div className="text-muted">Unspoken 3rd Pers. Masc. Plur.</div>
                        : <NPPicker
                            asObject
                            np={verb.object}
                            counterPart={subject}
                            onChange={handleObjectChange}
                            opts={textOpts}
                        />}
                </div>}
            </>}
            <div className="my-2">
                <TensePicker
                    verbs={verbs}
                    verb={verb}
                    onChange={setVerb}
                    mode={mode}
                />
            </div>
        </div>
        {(verbPhrase && (mode === "phrases")) &&
            <VPDisplay VP={verbPhrase} opts={textOpts} />
        }
        {(verb && (mode === "charts")) && <ChartDisplay VS={verb} opts={textOpts} />} 
    </div>
}

export default PhraseBuilder;

function hasPronounConflict(subject: NPSelection | undefined, object: undefined | VerbObject): boolean {
    const subjPronoun = (subject && subject.type === "pronoun") ? subject : undefined;
    const objPronoun = (object && typeof object === "object" && object.type === "pronoun") ? object : undefined; 
    if (!subjPronoun || !objPronoun) return false;
    return isInvalidSubjObjCombo(subjPronoun.person, objPronoun.person);
}

function verbPhraseComplete({ subject, verb }: { subject: NPSelection | undefined, verb: VerbSelection | undefined }): VPSelection | undefined {
    if (!subject) return undefined;
    if (!verb) return undefined;
    if (verb.object === undefined) return undefined;
    return {
        type: "VPSelection",
        subject,
        object: verb.object,
        verb,
    };
}

function showRole(VP: VPRendered | undefined, member: "subject" | "object") {
    return VP 
        ? <span className="ml-2">
            {(VP.king === member ? kingEmoji : VP.servant === member ? servantEmoji : "")}
        </span>
        : "";
}

type SOClump = { subject: NPSelection | undefined, verb: VerbSelection | undefined };
function switchSubjObj({ subject, verb }: SOClump): SOClump {
    if (!subject|| !verb || !verb.object || !(typeof verb.object === "object")) {
        return { subject, verb };
    }
    return {
        subject: verb.object,
        verb: {
            ...verb,
            object: subject,
        }
    };
}