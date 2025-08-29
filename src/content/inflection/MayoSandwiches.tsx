import type { Types as T } from "@lingdocs/pashto-inflector";
import {
  Examples,
} from "@lingdocs/pashto-inflector";

const mayoSandwiches = [
  {
    meaning: "from / than",
    sandwiches: [
      { p: "له ...", f: "la ...", required: true },
      { p: "له ... نه", f: "la ... na", required: false },
      {
        p: "له ... څخه",
        f: "la ... tsúkha",
        required: false,
      },
    ],
  },
  {
    meaning: "without",
    sandwiches: [
      { p: "بې ...", f: "be ...", required: true },
      { p: "بې له ...", f: "be la ...", required: true },
      { p: "له ... پرته", f: "la ... prata", required: false },
      { p: "پرته له ...", f: "prata la ...", required: true },
    ],
  },
  {
    meaning: "until / up to",
    sandwiches: [
      { p: "تر ...", f: "tur ...", required: true },
      {
        p: "تر ... پورې",
        f: "tur ... pore",
        required: true,
      },
    ],
  },
];

export default function MayoSandwiches({ opts }: { opts: T.TextOptions }) {
  return (
    <div>
      {mayoSandwiches.map((section) => (
        <div key={section.meaning}>
          <h5>"{section.meaning}"</h5>
          <div className="d-flex flex-wrap flex-row" style={{ gap: "2rem" }}>
            {section.sandwiches.map((sandwich) => (
              <Examples opts={opts}>{[sandwich]}</Examples>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
