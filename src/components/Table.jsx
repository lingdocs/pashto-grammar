import {
    Examples,
} from "@lingdocs/ps-react";
export const femColor = "#FFECEF"
export const mascColor = "#C1D5F4";

const isObject = x => (
    typeof x === "object" && x !== null
);

function Table({ headRow, children, opts, wide }) {
    return (
        <div style={{ overflowX: "auto", marginBottom: "1em" }}>
            <table className="table" style={wide ? { minWidth: "600px" } : {}}>
                {headRow && <thead>
                    <tr>
                        {headRow.map((h, i) => (
                            <th scope="col" key={`headRow ${i}`}>{h}</th>
                        ))}
                    </tr>
                </thead>}
                <tbody>
                    {children.map((row, i) => (
                        <tr key={`row ${i}`}>
                            {row.map((cell, j) => (
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