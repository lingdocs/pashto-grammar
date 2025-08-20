import {
  InlinePs,
  defaultTextOptions as opts,
} from "@lingdocs/ps-react";
import genderColors from "../lib/gender-colors";

export default function GenderTable({ rows }: { rows: any }) {
  return <table className="table" style={{ tableLayout: "fixed" }}>
    <thead>
      <tr>
        <th scope="col">Masculine</th>
        <th scope="col">Feminine</th>
      </tr>
    </thead>
    <tbody>
      {rows.map((row: any, i: number) => (
        <tr key={`gender-row${i}`}>
          {["masc", "fem"].map((gender) => {
            const item = row[gender];
            return <td key={`row-${i}-${gender}`} style={{ background: genderColors[gender === "masc" ? "m" : "f"] }}>
              {item.ending && <div>
                {typeof item.ending === "string" ? item.ending
                  : <InlinePs opts={opts} ps={item.ending} />}
              </div>}
              <div>
                {item.ending ? "eg. " : ""}<InlinePs opts={opts} ps={item.ex} />
              </div>
            </td>
          })}
        </tr>
      ))}
    </tbody>
  </table>;
} 
