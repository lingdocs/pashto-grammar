import React from "react";

function GameDisplay({ record: { title, Game } }: { record: GameRecord }) {
    return <div>
        <h4 className="my-4"><span role="img" aria-label="">🎮</span> {title}</h4>
        <Game />
    </div>
}

export default GameDisplay;