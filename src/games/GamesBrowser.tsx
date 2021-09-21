import React, { useState } from "react";
import games from "./games";
import { useUser } from "../user-context";
import GameDisplay from "./GameDisplay";

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
                {chapter.items.map((record) => {
                    const done = user && user.tests.some(t => t.id === record.id);
                    const open = opened === record.id;
                    return <div key={record.title}>
                        <div className="d-flex flex-row justify-content-between align-items-center">
                            <div>
                                <h4 className="my-4 clickable" onClick={() => handleTitleClick(record.id)}>
                                    {open ? "🞃" : "🞂"} {record.title}
                                </h4>
                            </div>
                            <div>
                                <h4>{done ? "✅" : ""}</h4>
                            </div>
                        </div>
                        {open && <record.Game />}
                    </div>
                })}
            </>
        ))}
    </div>
}

export default GamesBrowser;