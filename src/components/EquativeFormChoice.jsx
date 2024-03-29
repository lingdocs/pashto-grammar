import { useState } from "react";
import {
    VerbFormDisplay,
    ButtonSelect,
} from "@lingdocs/ps-react";

function EquativeFormChoice({forms, opts}) {
    const [choice, setChoice] = useState("pure");
    return (
        <div>
            <div className="text-center my-3">
                <ButtonSelect
                    small
                    options={[
                        { label: "Equative", value: "pure" },
                        { label: "w/ Pronouns", value: "sentence" },
                    ]}
                    value={choice}
                    handleChange={(p) => setChoice(p)}
                />
            </div>
            <VerbFormDisplay
                displayForm={forms[choice].displayForm}
                english={forms[choice].english}
                textOptions={opts}
                shortDefault
            />
        </div>
    );
}

export default EquativeFormChoice;