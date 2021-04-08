import React, { useState } from "react";
import {
    VerbFormDisplay,
    ButtonSelect,
} from "@lingdocs/pashto-inflector";

function EquativeFormChoice({forms, opts}) {
    const [choice, setChoice] = useState("pure");
    return (
        <div>
            <div className="text-center my-3">
                <ButtonSelect
                    options={[
                        { label: "Equative", value: "pure" },
                        { label: "w/ Sentences", value: "sentence" },
                    ]}
                    value={choice}
                    handleChange={(p) => setChoice(p)}
                />
            </div>
            <VerbFormDisplay
                displayForm={forms[choice].displayForm}
                english={forms[choice].english}
                textOptions={opts}
            />
        </div>
    );
}

export default EquativeFormChoice;