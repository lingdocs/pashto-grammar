import Table from "../../components/Table";
import { defaultTextOptions as opts } from "@lingdocs/ps-react";

function PluralTable({ children, inflection }) {
  return (
    <Table
      wide={false}
      headRow={[
        ...[
          <div>
            <div>singular</div>
            {inflection && <div className="small text-muted">plain</div>}
          </div>,
          <div>
            <div>plural</div>
            {inflection && <div className="small text-muted">inflected</div>}
          </div>,
        ],
        ...(children[0].length === 3
          ? [
              <div>
                <div>plural and inflected</div>
                {inflection && (
                  <div className="small text-muted">double inflected</div>
                )}
              </div>,
            ]
          : []),
      ]}
      opts={opts}
    >
      {children}
    </Table>
  );
}

export default PluralTable;
