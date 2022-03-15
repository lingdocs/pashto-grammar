import { useState } from "react";
import NPPicker from "../np-picker/NPPicker";
import VerbPicker from "../VerbPicker";
import VPDisplay from "./VPDisplay";
import ObjectDisplay from "./ObjectDisplay";
import { verbs } from "../../words/words";

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
    const verbPhrase: VPSelection | undefined = verbPhraseComplete({ subject, verb });
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
        {verbPhrase && <div>
            <VPDisplay VP={verbPhrase} />
        </div>}
    </div>
}

export default PhraseBuilder;