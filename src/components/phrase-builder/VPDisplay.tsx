import { renderVP, compileVP } from "../../lib/phrase-building";
import {
    InlinePs,
    defaultTextOptions as opts,
} from "@lingdocs/pashto-inflector";

function VPDisplay({ VP }: { VP: VPSelection }) {
    // TODO: Possibly put the servant shrinking in here after the render
    const result = compileVP(renderVP(VP));
    const rPs = "long" in result.ps ? result.ps.long : result.ps; 
    return <div className="text-center mt-2">
        {rPs.map((r, i) => <div key={i}>
            <InlinePs opts={opts}>{r}</InlinePs>
        </div>)}
        {result.e && <div className="text-muted">
            {result.e.map((e, i) => <div key={i}>{e}</div>)}
        </div>}
    </div>
}

export default VPDisplay;