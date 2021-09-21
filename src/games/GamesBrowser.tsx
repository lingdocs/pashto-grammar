import React, { useState } from "react";
import games from "./games";
import { useUser } from "../user-context";

function GamesBrowser() {
    const { user } = useUser();
    const [opened, setOpened] = useState<string | undefined>(undefined);
    function handleTitleClick(id: string) {
        setOpened(prev => (
            prev === id ? undefined : id
        ));
    }
    return <div>
        {games.map((chapter) => (
            <>
                <h3 key={chapter.chapter}>{chapter.chapter}</h3>
                {chapter.items.map(({ id, title, Game }) => {
                    const done = user && user.tests.some(t => t.id === id);
                    const open = opened === id;
                    return <div key={id}>
                        <div className="d-flex flex-row justify-content-between align-items-center">
                            <div>
                                <h4 className="my-4 clickable" onClick={() => handleTitleClick(id)}>
                                    {open ? "🞃" : "🞂"} {title}
                                </h4>
                            </div>
                            <div>
                                <h4>{done ? "✅" : ""}</h4>
                            </div>
                        </div>
                        {open && <Game />}
                    </div>
                })}
            </>
        ))}
    </div>
}

export default GamesBrowser;