import { useState } from "react";
import NPPicker from "../np-picker/NPPicker";
import VerbPicker from "../VerbPicker";
import VPDisplay from "./VPDisplay";
import ObjectDisplay from "./ObjectDisplay";
import { verbs } from "../../words/words";
import {
    isInvalidSubjObjCombo,
} from "../../lib/np-tools";

function verbPhraseComplete({ subject, verb, shrinkServant }: { subject: NPSelection | undefined, verb: VerbSelection | undefined, shrinkServant: boolean }): VPSelection | undefined {
    if (!subject) return undefined;
    if (!verb) return undefined;
    if (verb.object === undefined) return undefined;
    return {
        type: "VPSelection",
        shrinkServant,
        subject,
        object: verb.object,
        verb,
    };
}

export function PhraseBuilder() {
    const [subject, setSubject] = useState<NPSelection | undefined>(undefined);
    const [verb, setVerb] = useState<VerbSelection | undefined>(undefined);
    const [shrinkServant, setShrinkServant] = useState<boolean>(false);
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
    function handleShrinkServantChange(e: React.ChangeEvent<HTMLInputElement>) {
        setShrinkServant(e.target.checked);
    }
    const verbPhrase: VPSelection | undefined = verbPhraseComplete({ subject, verb, shrinkServant });
    return <div>
        <div className="d-flex flex-row justify-content-between">
            <div className="mr-2">
                <div className="h5">Subject</div>
                <NPPicker
                    np={subject}
                    counterPart={verb ? verb.object : undefined}
                    onChange={handleSubjectChange}
                />
            </div>
            {verb && (verb.object !== "none") && <div className="mr-2">
                <div className="h5">Object</div>
                <ObjectDisplay object={verb.object} counterPart={subject} onChange={handleObjectChange} />
            </div>}
            <div>
                <div className="h5">Verb</div>
                <VerbPicker verbs={verbs} verb={verb} onChange={setVerb} />
            </div>
        </div>
        {/* TODO: make this appear conditionally */}
        {(verbPhrase?.object && typeof verbPhrase.object === "object") && <div className="form-group form-check">
            <input
                className="form-check-input"
                name="shrinkServant"
                type="checkbox"
                checked={shrinkServant}
                onChange={handleShrinkServantChange}
            />
            <label className="form-check-label">Shrink servant</label>
        </div>}
        {verbPhrase && <div>
            <VPDisplay VP={verbPhrase} />
        </div>}
    </div>
}

export default PhraseBuilder;