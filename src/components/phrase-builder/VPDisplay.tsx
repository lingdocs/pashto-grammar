import { useState } from "react";
import { renderVP, compileVP } from "../../lib/phrase-building";
import {
    InlinePs,
    defaultTextOptions as opts,
    Types as T,
} from "@lingdocs/pashto-inflector";
import classNames from "classnames";

function buttonClass(active: boolean, side: "l" | "r") {
    return classNames(
        "btn btn-sm btn-outline-secondary",
        { active },
        { "mr-1": side === "l" },
        { "ml-1": side === "r" },
    );
}

function VPDisplay({ VP }: { VP: VPSelection }) {
    const [form, setForm] = useState<FormVersion>({ removeKing: false, shrinkServant: false });
    // TODO: Possibly put the servant shrinking in here after the render
    const result = compileVP(renderVP(VP), form);
    const servantShrinkable = VP.object && VP.object !== "none";
    const toggleForm = (f: "removeKing" | "shrinkServant") => () => {
        setForm(oForm => ({
            ...oForm,
            [f]: !oForm[f],
        }));
    }
    return <div className="text-center mt-2">
        <div className="my-3">
            <button
                onClick={toggleForm("removeKing")}
                className={buttonClass(form.removeKing, "l")}
            >
                🚫 King
            </button>
            {servantShrinkable && <button
                onClick={toggleForm("shrinkServant")}
                className={buttonClass(form.shrinkServant, "r")}
            >
                👶 Servant
            </button>}
        </div>
        {"long" in result.ps ?
            <div>
                {/* <div className="h6">Long Verb:</div> */}
                <VariationLayer vs={result.ps.long} />
                {/* <div className="h6">Short Verb:</div> */}
                <VariationLayer vs={result.ps.short} />
                {result.ps.mini && <>
                    {/* <div className="h6">Mini Verb:</div> */}
                    <VariationLayer vs={result.ps.mini} />
                </>}
            </div>
            : <VariationLayer vs={result.ps} />
        }
        {result.e && <div className="text-muted">
            {result.e.map((e, i) => <div key={i}>{e}</div>)}
        </div>}
    </div>
}

function VariationLayer({ vs }: { vs: T.PsString[] }) {
    return <div className="mb-2">
        {vs.map((r, i) => <div key={i}>
            <InlinePs opts={opts}>{r}</InlinePs>
        </div>)}
    </div>;
}

export default VPDisplay;