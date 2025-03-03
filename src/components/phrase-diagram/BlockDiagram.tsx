import {
  renderNPSelection,
  Types as T,
  renderAPSelection,
  NPBlock,
  APBlock,
  getEnglishFromRendered,
} from "@lingdocs/ps-react";

function BlockDiagram({
  opts,
  children,
}: {
  opts: T.TextOptions;
  children: T.NPSelection | T.APSelection;
}) {
  try {
    const rendered =
      children.type === "AP"
        ? renderAPSelection(children, 0)
        : renderNPSelection(
            children,
            false,
            false,
            "subject",
            "none",
            false,
            "no"
          );
    const english = getEnglishFromRendered(rendered);
    return (
      <div className="mb-3">
        <div
          className="d-flex flex-row justify-content-center text-center"
          style={{ maxWidth: "100%" }}
        >
          {rendered.type === "NP" ? (
            <NPBlock script="f" opts={opts} english={english}>
              {rendered}
            </NPBlock>
          ) : (
            <APBlock script="f" opts={opts} english={english}>
              {rendered}
            </APBlock>
          )}
        </div>
      </div>
    );
  } catch (e) {
    console.log(e);
    return <div>ERROR</div>;
  }
}

export default BlockDiagram;
