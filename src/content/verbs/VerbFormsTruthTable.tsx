import { useState } from "react";
import { tenseData } from "./tense-data";
import Media from "react-media";
import { Camera, Video } from "../../components/terms-links";
import classNames from "classnames";

type State = [boolean, boolean, boolean];

function VerbFormsTruthTable() {
  const [state, setState] = useState<State>([false, false, false]);
  const [hitSwitch, setHitSwitch] = useState<boolean>(false);
  const [form] = tenseData.find(([t, ...switches]) => {
    return JSON.stringify(state) === JSON.stringify(switches);
  }) as ["string"];
  return (
    <div className="mb-4">
      <div style={{ overflowX: "auto", marginBottom: "1em" }}>
        <table
          className="table table-bordered table-striped"
          style={{ minWidth: "425px" }}
        >
          <thead>
            <tr>
              <th>form</th>
              <th scope="col">Has 'ba'</th>
              <th scope="col">Imperfective / Perfective</th>
              <th scope="col">Stem / Root</th>
            </tr>
          </thead>
          <tbody>
            {tenseData.map((t) => (
              <tr
                className={classNames({
                  "table-primary": hitSwitch && form === t[0],
                })}
              >
                <td>{t[0]}</td>
                <td>{t[1] ? "yes" : "no"}</td>
                <td>
                  {t[2] ? (
                    <div>
                      {" "}
                      <Camera />
                      {` `}perfective
                    </div>
                  ) : (
                    <div>
                      <Video />
                      {` `}imperfective
                    </div>
                  )}
                </td>
                <td>{t[3] ? "root" : "stem"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>Hit the switches to try the combinations yourself!</p>
      <SwitchBar
        onHitSwitch={() => {
          if (!hitSwitch) setHitSwitch(true);
        }}
        state={state}
        setState={setState}
      />
      <div className="text-center">
        <h5 className="text-center">{form}</h5>
        <StateInFormula state={state} />
      </div>
    </div>
  );
}

function StateInFormula({
  state: [hasBa, perfective, root],
}: {
  state: State;
}) {
  return (
    <samp className="my-2">
      {`${hasBa ? "ba + " : ""}${perfective ? "" : "im"}perfective ${
        root ? "root" : "stem"
      } + ${root ? "past" : "present"} ending`}
    </samp>
  );
}

function SwitchBar({
  state,
  setState,
  onHitSwitch,
}: {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
  onHitSwitch: () => void;
}) {
  const makeToggle = (i: 0 | 1 | 2) => () => {
    onHitSwitch();
    setState((os) => {
      const ns = [...os] as [boolean, boolean, boolean];
      ns[i] = !ns[i];
      return ns;
    });
  };
  return (
    <div className="text-center mb-4">
      <div
        className="row text-center mb-3"
        style={{ maxWidth: "600px", margin: "0 auto" }}
      >
        <div className="col">
          <Switch
            state={state[0]}
            toggle={makeToggle(0)}
            label={["no ba", "with ba"]}
          />
        </div>
        <div className="col">
          <Switch
            state={state[1]}
            toggle={makeToggle(1)}
            label={["imperfective", "perfective"]}
          />
        </div>
        <div className="col">
          <Switch
            state={state[2]}
            toggle={makeToggle(2)}
            label={["stem", "root"]}
          />
        </div>
      </div>
    </div>
  );
}

function Switch({
  state,
  toggle,
  label,
}: {
  label: [string, string];
  state: boolean;
  toggle: () => void;
}) {
  const borderRadius = "8px";
  const border = "solid 2px black";
  return (
    <div>
      <div>{label[0]}</div>
      <Media
        queries={{
          small: "(max-width: 599px)",
        }}
      >
        {(matches) => (
          <div
            className="clickable"
            onClick={toggle}
            style={{
              border,
              height: matches.small ? "6rem" : "9rem",
              borderRadius,
              position: "relative",
            }}
          >
            <div
              style={{
                border,
                borderRadius,
                height: "50%",
                width: "33%",
                top: "50%",
                transform: "translateY(-50%) translateX(105%)",
                position: "absolute",
              }}
            >
              <div
                style={{
                  border,
                  borderRadius,
                  width: "50%",
                  top: state ? "75%" : "25%",
                  transform: "translateY(-50%) translateX(55%)",
                  position: "absolute",
                }}
              />
            </div>
          </div>
        )}
      </Media>
      <div>{label[1]}</div>
    </div>
  );
}

export default VerbFormsTruthTable;
