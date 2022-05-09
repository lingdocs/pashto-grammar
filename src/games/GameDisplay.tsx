import { useUser } from "../user-context";
import { useState } from "react";

function GameDisplay({ record: { title, Game, id } }: { record: GameRecord }) {
    const { user } = useUser();
    const [running, setRunning] = useState<boolean>(false);
    const completed = user?.tests.some((t) => (
        // TODO: Or if it's in the locally stored (unposted test results)
        (t.done === true) && (t.id === id)
    ));
    function onStartStop(a: "start" | "stop") {
        if (a === "start" && !running) {
            setRunning(true);
        }
        if (a === "stop") {
            setRunning(false);
        }
    }
    return <>
        {running && <div style={{
            position: "absolute",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(7px)",
            top: "0px",
            left: "0px",
            width: "100%",
            height: "100%",
            zIndex: 2,
        }}></div>}
        <div style={{ position: "relative", zIndex: 9999 }}>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <h4 className="my-4"><span role="img" aria-label="">🎮</span> {title}</h4>
                </div>
                <div>
                    <h4>{completed ? "✅" : ""}</h4>
                </div>
            </div>
            {Game(onStartStop)}
        </div>
    </>
}

export default GameDisplay;