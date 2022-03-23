import { useState } from "react";
import { renderVP, compileVP } from "../../lib/phrase-building";
import {
    InlinePs,
    defaultTextOptions as opts,
    ButtonSelect,
    Types as T,
} from "@lingdocs/pashto-inflector";

function adjustForm(form: FormVersion, servantShrinkable: boolean): FormVersion {
    if (!servantShrinkable) {
        return form === "shortest"
            ? "no king"
            : form === "mini servant"
            ? "full"
            : form;
    }
    return form;
}

function VPDisplay({ VP }: { VP: VPSelection }) {
    const [form, setForm] = useState<FormVersion>("full");
    // TODO: Possibly put the servant shrinking in here after the render
    const result = compileVP(renderVP(VP), form);
    const servantShrinkable = VP.object && VP.object !== "none";
    return <div className="text-center mt-2">
        <div className="my-3">
            <ButtonSelect
                small
                options={[
                    { value: "full", label: "Full" },
                    { value: "no king", label: "No King" },
                    ...servantShrinkable ? [{ value: "mini servant", label: "Mini Servant" }] : [],
                    ...servantShrinkable ? [{ value: "shortest", label: "Shortest" }] : [],
                ]}
                value={adjustForm(form, servantShrinkable)}
                // @ts-ignore
                handleChange={setForm}
            />
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