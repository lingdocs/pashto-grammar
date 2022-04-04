import PronounPicker from "./NPPronounPicker";
import NounPicker from "./NPNounPicker";
import ParticiplePicker from "./NPParticiplePicker";
// import { getEnglishPronoun } from "../../lib/english-pronoun-tools";
// import { ButtonSelect } from "@lingdocs/pashto-inflector";
import { randomPerson } from "../../lib/np-tools";
import { useState, useEffect } from "react";
import { nouns, verbs } from "../../words/words";
// import { capitalizeFirstLetter } from "../../lib/text-tools";

const npTypes: NPType[] = ["pronoun", "noun", "participle"];

function NPPicker({ np, onChange, counterPart, asObject }: {
    onChange: (nps: NPSelection | undefined) => void,
    np: NPSelection | undefined,
    counterPart: NPSelection | VerbObject | undefined,
    asObject?: boolean,
}) {
    const [npType, setNpType] = useState<NPType | undefined>(np ? np.type : undefined);
    useEffect(() => {
        setNpType(np ? np.type : undefined);
    }, [np]);
    function handleClear() {
        if (np && np.type === "noun" && np.dynamicComplement) return;
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
    const isDynamicComplement = np && np.type === "noun" && np.dynamicComplement;
    const clearButton = <button className="btn btn-sm btn-light mb-2" onClick={handleClear}>X</button>;
    return <div>
        {!npType && <div className="d-flex flex-row align-items-center text-center mt-3">
            <div className="h6 mr-3">
                Choose NP
            </div>
            <div className="ml-3">
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
        </div>}
        {(npType === "pronoun" && np?.type === "pronoun")
            ? <PronounPicker
                asObject={asObject}
                pronoun={np}
                onChange={onChange}
                clearButton={clearButton}
            />
            : npType === "noun"
            ? <NounPicker
                nouns={nouns}
                noun={(np && np.type === "noun") ? np : undefined}
                onChange={onChange}
                clearButton={!isDynamicComplement ? clearButton : undefined}
            />
            : npType === "participle"
            ? <ParticiplePicker
                verbs={verbs}
                participle={(np && np.type === "participle") ? np : undefined}
                onChange={onChange}
                clearButton={clearButton}
            />
            : null
        }
    </div>;
}

// {(npType && !isDynamicComplement) && }

export default NPPicker;