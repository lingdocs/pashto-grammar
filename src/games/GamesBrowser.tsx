import { useState } from "react";
import games from "./games";
import { useUser } from "../user-context";
import Link from "../components/Link";
// @ts-ignore
import SmoothCollapse from "react-smooth-collapse";
import { AT } from "@lingdocs/lingdocs-main";

function GamesBrowser() {
  const { user } = useUser();
  const [opened, setOpened] = useState<string | undefined>(undefined);
  function handleChapterClick(id: string) {
    setOpened((prev) => (prev === id ? undefined : id));
  }
  return (
    <div>
      {games.map((chapter) => (
        <div key={chapter.chapter}>
          <ChapterDisplay
            chapter={chapter}
            user={user}
            handleClick={handleChapterClick}
            expanded={opened === chapter.chapter}
          />
        </div>
      ))}
    </div>
  );
}

function ChapterDisplay({
  chapter,
  user,
  handleClick,
  expanded,
}: {
  chapter: { chapter: string; items: GameRecord[] };
  user: AT.LingdocsUser | undefined;
  handleClick: (chapter: string) => void;
  expanded: boolean;
}) {
  const [opened, setOpened] = useState<string | undefined>(undefined);
  const progress = getPercentageComplete(chapter, user?.tests);
  function handleTitleClick(id: string) {
    setOpened((prev) => (prev === id ? undefined : id));
  }
  return (
    <div className="mb-3">
      <div
        className="card clickable"
        onClick={() => handleClick(chapter.chapter)}
      >
        <div
          className="card-body"
          style={{
            backgroundColor: expanded ? "#e6e6e6" : "inherit",
          }}
        >
          <h4>{chapter.chapter}</h4>
          <ChapterProgress progress={progress} />
        </div>
      </div>
      <SmoothCollapse expanded={expanded}>
        {chapter.items.map(({ id, title, Game }) => {
          const done = user?.tests.some((t) => t.done && t.id === id);
          const open = opened === id;
          return (
            <div key={id}>
              <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                  <h5
                    className="my-3 clickable"
                    onClick={() => handleTitleClick(id)}
                  >
                    <i
                      className={`fas fa-caret-${open ? "down" : "right"}`}
                    ></i>{" "}
                    {title}
                    {` `}
                  </h5>
                </div>
                <div>{done && <h4>✅</h4>}</div>
              </div>
              <SmoothCollapse expanded={open}>
                {open && <Game inChapter={false} />}
              </SmoothCollapse>
            </div>
          );
        })}
      </SmoothCollapse>
    </div>
  );
}

function ChapterProgress({ progress }: { progress: "not logged in" | number }) {
  if (progress === "not logged in") {
    return (
      <div className="small text-muted">
        <Link to="/account">Log in</Link> to see progress
      </div>
    );
  }
  return (
    <div>
      <div className="small text-muted">{progress}% mastered</div>
      <div className="progress my-1" style={{ height: "5px" }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function getPercentageComplete(
  chapter: { chapter: string; items: GameRecord[] },
  tests: undefined | AT.TestResult[]
): "not logged in" | number {
  if (!tests) return "not logged in";
  const chapterTestIds = chapter.items.map((gr) => gr.id);
  const userCompletedIds = tests.filter((t) => t.done).map((t) => t.id);

  const required = chapterTestIds.length;
  const completed = chapterTestIds.filter((x) =>
    userCompletedIds.includes(x)
  ).length;

  return Math.round((completed / required) * 100);
}

export default GamesBrowser;
