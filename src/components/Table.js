import React from "react";
import {
    Examples,
} from "@lingdocs/pashto-inflector";
export const femColor = "#FFECEF"
export const mascColor = "#C1D5F4";

const isObject = x => (
    typeof x === "object" && x !== null
);

function Table({ headRow, children, opts, wide }) {
    return (
        <div style={{ overflowX: "auto", marginBottom: "1em" }}>
            <table class="table" style={wide ? { minWidth: "635px" } : {}}>
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
                                    {isObject(cell)
                                        ? <Examples opts={opts}>{[cell]}</Examples>
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