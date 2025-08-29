import type { Types as T } from "@lingdocs/pashto-inflector";
import {
  concatPsString,
  ButtonSelect,
  InlinePs,
  grammarUnits,
} from "@lingdocs/pashto-inflector";
import { useState } from "react";
import EquativeFormChoice from "../../components/EquativeFormChoice";

function WithTailChoice({ opts, ba }: { opts: T.TextOptions; ba: boolean }) {
  const [choice, setChoice] = useState("aay");
  const waay = concatPsString(
    { p: "و", f: "w" },
    choice === "aay" ? { p: "ای", f: "aay" } : { p: "ی", f: "ay" }
  );
  return (
    <div>
      <div className="text-center my-3">
        <div className="text-muted mb-1">
          <small>
            The spelling/pronunciation of the non-inflecting tail can vary based
            on dialect
          </small>
        </div>
        <ButtonSelect
          options={[
            {
              label: <InlinePs opts={opts} ps={{ p: "ای", f: "aay" }} />,
              value: "aay",
            },
            {
              label: <InlinePs opts={opts} ps={{ p: "ی", f: "ay" }} />,
              value: "ay",
            },
          ]}
          value={choice}
          handleChange={(p) => setChoice(p)}
        />
      </div>
      <EquativeFormChoice
        forms={{
          sentence: !ba
            ? {
              displayForm: concatPsString(
                { p: "کاشکې ... ...", f: "kaashke ... ..." },
                " ",
                waay,
                { p: "!", f: "!" }
              ),
              english: [[["If only ... was/were ...!"]]],
            }
            : {
              displayForm: concatPsString(
                { p: "به ...", f: "ba ..." },
                " ",
                waay
              ),
              english: [[["... would have been ..."]]],
            },
          pure: {
            displayForm: !ba
              ? waay
              : concatPsString(grammarUnits.baParticle, " ", waay),
          },
        }}
        opts={opts}
      />
    </div>
  );
}

export default WithTailChoice;
