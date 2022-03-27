import PronounPicker from "./NPPronounPicker";
import NounPicker from "./NPNounPicker";
import ParticiplePicker from "./NPParticiplePicker";
// import { getEnglishPronoun } from "../../lib/english-pronoun-tools";
// import { ButtonSelect } from "@lingdocs/pashto-inflector";
import { randomPerson } from "../../lib/np-tools";
import { useState } from "react";
import { nouns, verbs } from "../../words/words";
// import { capitalizeFirstLetter } from "../../lib/text-tools";

const npTypes: NPType[] = ["pronoun", "noun", "participle"];

function NPPicker({ np, onChange, counterPart, asObject }: { onChange: (nps: NPSelection | undefined) => void, np: NPSelection | undefined, counterPart: NPSelection | VerbObject | undefined, asObject?: boolean }) {
    // eslint-disable-next-line
    const [npType, setNpType] = useState<NPType | undefined>(np ? np.type : undefined);
    function handleClear() {
        setNpType(undefined);
        onChange(undefined);
    }
    function handleNPTypeChange(ntp: NPType) {
        if (ntp === "pronoun") {
            const person = randomPerson({ counterPart });
            const pronoun: PronounSelection = {
                type: "pronoun",
                person,
                distance: "far",
            };
            setNpType(ntp);
            onChange(pronoun);
        } else {
            onChange(undefined);
            setNpType(ntp);
        }
    }
    return <div>
        {!npType ? <div className="text-center mt-3">
            {npTypes.map((npt) => <div className="mb-2">
                <button
                    key={npt}
                    type="button"
                    className="mr-2 btn btn-sm btn-outline-secondary"
                    onClick={() => handleNPTypeChange(npt)}
                >
                    {npt}
                </button>
            </div>)}
        </div>
        : <button className="btn btn-sm btn-light mb-2" onClick={handleClear}>X</button>}
        {np ?
            ((np.type === "pronoun"
                ? <PronounPicker asObject={asObject} pronoun={np} onChange={onChange} />
                : np.type === "noun"
                ? <NounPicker nouns={nouns} noun={np} onChange={onChange} />
                : <ParticiplePicker verbs={verbs} participle={np} onChange={onChange} />))
        : (npType === "noun")
        ? <NounPicker nouns={nouns} noun={np} onChange={onChange} />
        : (npType === "participle")
        ? <ParticiplePicker verbs={verbs} participle={np} onChange={onChange} />
        : null}
    </div>;
}

export default NPPicker;