import React from "react";
import { useUser } from "../user-context";

function GameDisplay({ record: { title, Game, id } }: { record: GameRecord }) {
    const { user } = useUser();
    const completed = user?.tests.some((t) => (
        (t.done === true) && (t.id === id)
    ));
    return <div>
        <h4 className="my-4"><span role="img" aria-label="">🎮</span> {title} {completed ? "✅" : ""}</h4>
        <Game />
    </div>
}

export default GameDisplay;