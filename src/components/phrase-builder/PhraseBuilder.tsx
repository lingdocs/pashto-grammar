import { useState } from "react";
import NPPicker from "../np-picker/NPPicker";
import VerbPicker from "../VerbPicker";
import ObjectDisplay from "./ObjectDisplay";
import { verbs } from "../../words/words";

export function PhraseBuilder() {
    const [subject, setSubject] = useState<NPSelection | undefined>(undefined);
    const [verb, setVerb] = useState<VerbSelection | undefined>(undefined);
    function handleObjectChange(object: NPSelection | undefined) {
        if (!verb) return;
        if ((verb.object === "none") || (typeof verb.object === "number")) return;
        setVerb({
            ...verb,
            object,
        });
    }
    console.log({ subject, verb });
    return <div>
        <div className="d-flex flex-row justify-content-between">
            <div className="mr-2">
                <div className="h5">Subject</div>
                <NPPicker np={subject} onChange={setSubject} />
            </div>
            {verb && (verb.object !== "none") && <div className="mr-2">
                <div className="h5">Object</div>
                <ObjectDisplay object={verb.object} onChange={handleObjectChange} />
            </div>}
            <div>
                <div className="h5">Verb</div>
                <VerbPicker verbs={verbs} verb={verb} onChange={setVerb} />
            </div>
        </div>
    </div>
}

export default PhraseBuilder;