import {
  Examples,
} from "@lingdocs/ps-react";
export const femColor = "#FFECEF"
export const mascColor = "#C1D5F4";

const isObject = (x: any) => (
  typeof x === "object" && x !== null
);

function Table({ headRow, children, opts, wide }: {
  headRow: any,
  children: any,
  opts: any,
  wide: any,
}) {
  return (
    <div style={{ overflowX: "auto", marginBottom: "1em" }}>
      <table className="table" style={wide ? { minWidth: "600px" } : {}}>
        {headRow && <thead>
          <tr>
            {headRow.map((h: any, i: number) => (
              <th scope="col" key={`headRow ${i}`}>{h}</th>
            ))}
          </tr>
        </thead>}
        <tbody>
          {children.map((row: any, i: number) => (
            <tr key={`row ${i}`}>
              {row.map((cell: any, j: number) => (
                <td key={`row ${i}, cell ${j}`} style={(cell && cell.gender) ? { backgroundColor: cell.gender === "m" ? mascColor : femColor } : {}}>
                  {isObject(cell) && "p" in cell && "f" in cell
                    ? <Examples opts={opts}>{[cell]}</Examples>
                    : (!cell)
                      ? ""
                      : cell
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
