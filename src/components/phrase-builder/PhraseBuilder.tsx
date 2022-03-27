import { useState } from "react";
import NPPicker from "../np-picker/NPPicker";
import VerbPicker from "../VerbPicker";
import VPDisplay from "./VPDisplay";
import ObjectDisplay from "./ObjectDisplay";
import { verbs as verbsRaw } from "../../words/words";
import { renderVP } from "../../lib/phrase-building";
import {
    isInvalidSubjObjCombo,
} from "../../lib/np-tools";

const kingEmoji = "👑";
const servantEmoji = "🙇‍♂️";
const verbs = verbsRaw;

// TODO: error handling on error with rendering etc
export function PhraseBuilder() {
    const [subject, setSubject] = useState<NPSelection | undefined>(undefined);
    const [verb, setVerb] = useState<VerbSelection | undefined>(undefined);
    function handleSubjectChange(subject: NPSelection | undefined) {
        if (hasPronounConflict(subject, verb?.object)) {
            alert("That combination of pronouns is not allowed");
            return;
        }
        setSubject(subject);
    }
    function handleObjectChange(object: NPSelection | undefined) {
        if (!verb) return;
        if ((verb.object === "none") || (typeof verb.object === "number")) return;
        console.log("handling object change and checking", object);
        // check for pronoun conflict
        if (hasPronounConflict(subject, object)) {
            alert("That combination of pronouns is not allowed");
            return;
        }
        setVerb({ ...verb, object });
    }
    function handleSubjObjSwap() {
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
        {verb && (typeof verb.object === "object") && <div className="d-flex flex-row justify-content-around flex-wrap mb-2">
            <button onClick={handleSubjObjSwap} className="btn btn-sm btn-light">
                <i className="fas fa-exchange-alt mr-2" /> subj/obj
            </button>
            <div>{` `}</div>
        </div>}
        <div className="d-flex flex-row justify-content-around flex-wrap">
            <div className="mb-2">
                <div className="h4">Subject {showRole(VPRendered, "subject")}</div>
                <NPPicker
                    np={subject}
                    counterPart={verb ? verb.object : undefined}
                    onChange={handleSubjectChange}
                />
            </div>
            {verb && (verb.object !== "none") && <div className="mb-2">
                <div className="h4">Object {showRole(VPRendered, "object")}</div>
                <ObjectDisplay object={verb.object} counterPart={subject} onChange={handleObjectChange} />
            </div>}
            <div className="mb-2">
                <div className="h4">Verb</div>
                <VerbPicker verbs={verbs} verb={verb} onChange={setVerb} />
            </div>
        </div>
        {verbPhrase && <div>
            <VPDisplay VP={verbPhrase} />
        </div>}
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