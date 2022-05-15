import {
    Types as T,
    NPPicker,
} from "@lingdocs/pashto-inflector";
import entryFeeder from "../lib/entry-feeder";
import { useState } from "react";
import PhraseDiagram from "./phrase-diagram/PhraseDiagram";

function NPPlayground({ opts, npIn }: {
    opts: T.TextOptions,
    npIn: T.NPSelection | undefined,
}) {
    const [np, setNp] = useState<T.NPSelection | undefined>(npIn);
    return <div className="d-flex flex-column align-items-center">
        <div style={{ maxWidth: "225px", marginBottom: "2rem" }}>
            <NPPicker
                opts={opts}
                np={np}
                onChange={setNp}
                entryFeeder={entryFeeder}
                role="subject"
                counterPart={undefined}
                phraseIsComplete={false}
            />
        </div>
        {np && <PhraseDiagram opts={opts}>{[
            { type: "NP", block: np },
        ]}</PhraseDiagram>}
    </div>
}

export default NPPlayground;