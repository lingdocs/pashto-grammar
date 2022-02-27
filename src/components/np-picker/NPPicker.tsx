import PronounPicker from "./NPPronounPicker";
import { getEnglishPronoun } from "../../lib/english-pronoun-tools";
// import { ButtonSelect } from "@lingdocs/pashto-inflector";
import { randomPerson } from "../../lib/np-tools";
import { useState } from "react";
import { capitalizeFirstLetter } from "../../lib/text-tools";

const npTypes: NPType[] = ["noun", "pronoun", "participle"];

function NPPicker({ np, onChange }: { onChange: (nps: NPSelection | undefined) => void, np: NPSelection | undefined }) {
    // eslint-disable-next-line
    const [npType, setNpType] = useState<NPType | undefined>(np ? np.type : undefined);
    function handleClear() {
        setNpType(undefined);
        onChange(undefined);
    }
    function handleNPTypeChange(ntp: NPType) {
        if (ntp === "pronoun") {
            const person = randomPerson();
            const pronoun: PronounSelection = {
                type: "pronoun",
                e: capitalizeFirstLetter(getEnglishPronoun(person, "subject")),
                person,
                distance: "far",
            };
            onChange(pronoun);
        } else {
            setNpType(ntp);
        }
    }
    return <div>
        {!np ?
            <div>
                {npTypes.map((npt) => (
                    <button
                        key={npt}
                        type="button"
                        className="mr-2 btn btn-sm btn-outline-secondary"
                        onClick={() => handleNPTypeChange(npt)}
                    >
                        {npt}
                    </button>
                ))}
            </div>
        : <div onClick={handleClear}>X</div>}
        {np &&
            (np.type === "pronoun"
                ? <PronounPicker pronoun={np} onChange={onChange} />
                : <div>Not Implemented</div>)
        }
    </div>;
}

export default NPPicker;