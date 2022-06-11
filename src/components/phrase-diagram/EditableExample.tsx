import {
    Types as T,
    Examples,
    renderEP,
    compileEP,

} from "@lingdocs/pashto-inflector";
import { completeEPSelection } from "@lingdocs/pashto-inflector/dist/lib/phrase-building/render-ep";
import { useState } from "react";
// import EPBlocks from "./EPBlocks";

function getShort<X>(i: T.SingleOrLengthOpts<X>): X {
    if ("long" in i) {
        return i.long;
    }
    return i;
}

function EditableExample({ children: eps, opts }: { children: T.EPSelectionState, opts: T.TextOptions }) {
    const [mode, setMode] = useState<"example" | "blocks">("example");
    const EPS = completeEPSelection(eps);
    if (!EPS) {
        return <div>Error: Invalid/incomplete Phrase</div>;
    }
    const rendered = renderEP(EPS);
    const compiled = compileEP(rendered);
    const text: T.PsString = {
        ...getShort(compiled.ps)[0],
        e: compiled.e ? compiled.e.join(" / ") : undefined,
    };
    return <div>
        <div className="d-flex flex-row justify-content-beginning">
            {mode === "example" ? <div className="clickable" onClick={() => setMode("blocks")}>
                <i className="fas fa-cubes" />
            </div> : <div className="clickable" onClick={() => setMode("example")}>
                <i className="fas fa-align-left" />
            </div>}
        </div>
        {/* {mode === "example"
            ? <Examples opts={opts}>{[text]}</Examples>
            : <EPBlocks opts={opts}>{rendered}</EPBlocks>} */}
    </div>;
}

export default EditableExample;