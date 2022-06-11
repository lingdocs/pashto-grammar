import {
    renderNPSelection,
    Types as T,
    renderAPSelection,
    NPBlock,
    APBlock,
} from "@lingdocs/pashto-inflector";

function BlockDiagram({ opts, children }: {
    opts: T.TextOptions,
    children: T.NPSelection | T.APSelection,
}) {
    try {
    const rendered = children.type === "AP"
        ? renderAPSelection(children)
        : renderNPSelection(children, false, false, "subject", "none");
    return <div>
         <div className="d-flex flex-row justify-content-center" style={{ maxWidth: "100%" }}>
            {rendered.type === "NP"
                ? <NPBlock opts={opts}>{rendered}</NPBlock>
                : <APBlock opts={opts}>{rendered}</APBlock>}
        </div>
    </div>;
    } catch(e) {
        console.log(e);
        return <div>ERROR</div>;
    }
}


export default BlockDiagram;