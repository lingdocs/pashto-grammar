import { useUser } from "../user-context";

function GameDisplay({ record: { title, Game, id } }: { record: GameRecord }) {
    const { user } = useUser();
    const completed = user?.tests.some((t) => (
        // TODO: Or if it's in the locally stored (unposted test results)
        (t.done === true) && (t.id === id)
    ));
    console.log({ id, completed });
    return <div>
        <div className="d-flex flex-row justify-content-between align-items-center">
            <div>
                <h4 className="my-4"><span role="img" aria-label="">🎮</span> {title}</h4>
            </div>
            <div>
                <h4>{completed ? "✅" : ""}</h4>
            </div>
        </div>
        <Game inChapter />
    </div>;
}

export default GameDisplay;