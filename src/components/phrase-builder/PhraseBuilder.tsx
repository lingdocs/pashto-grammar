import { useState } from "react";
import NPPicker from "../np-picker/NPPicker";
import VerbPicker from "../VerbPicker";
import VPDisplay from "./VPDisplay";
import ObjectDisplay from "./ObjectDisplay";
import { verbs as verbsRaw } from "../../words/words";
import {
    isInvalidSubjObjCombo,
} from "../../lib/np-tools";

const verbs = verbsRaw.filter(v => !v.entry.c?.includes("gramm."))

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

// TODO: BIG ISSUE, IF YOU OPEN THE OBJECT PRONOUN BOX AND IT CONFLICTS WITH THE SUBJECT
// IT CAN SAY THE COMBO IS NOT ALLOWED AND SHOW SOMETHING BLANK
export function PhraseBuilder() {
    const [subject, setSubject] = useState<NPSelection | undefined>(undefined);
    const [verb, setVerb] = useState<VerbSelection | undefined>(undefined);
    function handleSubjectChange(subject: NPSelection | undefined) {
        const objPronoun = (typeof verb?.object === "object" && verb.object.type === "pronoun")
            ? verb.object.person
            : undefined;
        if (subject?.type === "pronoun" && objPronoun && isInvalidSubjObjCombo(subject.person, objPronoun)) {
            alert("That combination of pronouns is not allowed");
            return;
            // let newP = 0;
            // do {
            //     newP = randomPerson();
            // } while (isInvalidSubjObjCombo(newP, object.person));
            // return setSubject({ ...incoming, person: newP });
        }
        setSubject(subject);
    }
    function handleObjectChange(object: NPSelection | undefined) {
        if (!verb) return;
        if ((verb.object === "none") || (typeof verb.object === "number")) return;
        if (object?.type === "pronoun" && subject?.type === "pronoun" && isInvalidSubjObjCombo(object.person, subject.person)) {
            alert("That combination of pronouns is not allowed");
            return;
            // let newP = 0;
            // do {
            //     newP = randomPerson();
            // } while (isInvalidSubjObjCombo(newP, object.person));
            // return setSubject({ ...incoming, person: newP });
        }
        setVerb({
            ...verb,
            object,
        });
    }
    const verbPhrase: VPSelection | undefined = verbPhraseComplete({ subject, verb });
    return <div className="mt-3">
        <div className="row">
            <div className="col mb-2">
                <div className="h4">Subject</div>
                <NPPicker
                    np={subject}
                    counterPart={verb ? verb.object : undefined}
                    onChange={handleSubjectChange}
                />
            </div>
            {verb && (verb.object !== "none") && <div className="col mb-2">
                <div className="h4">Object</div>
                <ObjectDisplay object={verb.object} counterPart={subject} onChange={handleObjectChange} />
            </div>}
            <div className="col mb-2">
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