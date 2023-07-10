import { useState } from "react";
import { tenseData } from "./tense-data";

function SwitchPlayground() {
  const [state, setState] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const makeToggle = (i: 0|1|2) => () => setState(os => {
    const ns = [...os] as [boolean, boolean, boolean];
    ns[i] = !ns[i];
    return ns;
  });
  const [form] = tenseData.find(([t, ...switches]) => {
    return JSON.stringify(state) === JSON.stringify(switches);
  }) as ["string"];
  return <div className="text-center mb-4">
    <div className="row text-center mb-3" style={{ maxWidth: "600px", margin: "0 auto"}}>
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
    <h5>{form}</h5>
  </div>;
}

function Switch({ state, toggle, label }: { label: [string, string], state: boolean, toggle: () => void }) {
  const borderRadius = "8px";
  const border = "solid 2px black";
  return <div>
    <div>{label[0]}</div>
    <div className="clickable" onClick={toggle} style={{
      border,
      height: "8rem",
      borderRadius,
      position: "relative",
    }}>
      <div style={{
        border,
        borderRadius,
        height: "50%",
        width: "25%",
        top: "50%",
        transform: "translateY(-50%) translateX(150%)",
        position: "absolute",
      }}>
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
    <div>{label[1]}</div>
  </div>
}
      
export default SwitchPlayground;