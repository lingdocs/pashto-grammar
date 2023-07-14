import { useState, useRef, useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Reward, { RewardElement } from "react-rewards";
import Link from "../components/Link";
import { useUser } from "../user-context";
import "./timer.css";
import { getPercentageDone } from "../lib/game-utils";
import { saveResult, postSavedResults } from "../lib/game-results";
import { AT, getTimestamp } from "@lingdocs/lingdocs-main";
import { randFromArray, Types } from "@lingdocs/ps-react";
import ReactGA from "react-ga4";
import { isProd } from "../lib/isProd";
import autoAnimate from "@formkit/auto-animate";
const errorVibration = 200;
const strikesToFail = 3;

type GameState<Question> = (
  | {
      mode: "practice";
      showAnswer: boolean;
    }
  | {
      mode: "intro" | "test" | "fail" | "timeout" | "complete";
      showAnswer: false;
    }
) & {
  numberComplete: number;
  current: Question;
  timerKey: number;
  strikes: number;
  justStruck: boolean;
};

type GameReducerAction =
  | {
      type: "handle question response";
      payload: { correct: boolean };
    }
  | {
      type: "start";
      payload: "practice" | "test";
    }
  | {
      type: "quit";
    }
  | {
      type: "timeout";
    }
  | {
      type: "toggle show answer";
    }
  | {
      type: "skip";
    };

function GameCore<Question>({
  inChapter,
  getQuestion,
  amount,
  Display,
  DisplayCorrectAnswer,
  timeLimit,
  Instructions,
  studyLink,
  id,
}: {
  inChapter: boolean;
  id: string;
  studyLink: string;
  Instructions: (props: { opts?: Types.TextOptions }) => JSX.Element;
  getQuestion: () => Question;
  DisplayCorrectAnswer: (props: { question: Question }) => JSX.Element;
  Display: (props: QuestionDisplayProps<Question>) => JSX.Element;
  timeLimit: number;
  amount: number;
}) {
  const initialState: GameState<Question> = {
    mode: "intro",
    numberComplete: 0,
    current: getQuestion(),
    timerKey: 0,
    strikes: 0,
    justStruck: false,
    showAnswer: false,
  };
  // TODO: report pass with id to user info
  const rewardRef = useRef<RewardElement | null>(null);
  const parent = useRef<HTMLDivElement | null>(null);
  const { user, pullUser, setUser } = useUser();
  const [state, setStateDangerous] =
    useState<GameState<Question>>(initialState);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const gameReducer = (
    gs: GameState<Question>,
    action: GameReducerAction
  ): GameState<Question> => {
    if (action.type === "handle question response") {
      if (gs.mode === "test") {
        if (action.payload.correct) {
          const numberComplete = gs.numberComplete + 1;
          if (numberComplete === amount) {
            logGameEvent("passed");
            rewardRef.current?.rewardMe();
            handleResult(true);
            return {
              ...gs,
              numberComplete,
              justStruck: false,
              mode: "complete",
            };
          } else {
            return {
              ...gs,
              numberComplete,
              current: getQuestion(),
              justStruck: false,
            };
          }
        } else {
          punish();
          const strikes = gs.strikes + 1;
          if (strikes === strikesToFail) {
            logGameEvent("fail");
            handleResult(false);
            return {
              ...gs,
              strikes,
              mode: "fail",
              justStruck: false,
            };
          } else {
            return {
              ...gs,
              strikes,
              justStruck: true,
            };
          }
        }
      } /* (gs.mode === "practice") */ else {
        if (action.payload.correct) {
          const numberComplete = gs.numberComplete + (!gs.showAnswer ? 1 : 0);
          return {
            ...gs,
            numberComplete,
            current: getQuestion(),
            justStruck: false,
            showAnswer: false,
          };
        } else {
          punish();
          const strikes = gs.strikes + 1;
          return {
            ...gs,
            strikes,
            justStruck: true,
            showAnswer: false,
          };
        }
      }
    }
    if (action.type === "start") {
      logGameEvent(`started ${action.payload}`);
      return {
        ...initialState,
        mode: action.payload,
        current: getQuestion(),
        timerKey: gs.timerKey + 1,
      };
    }
    if (action.type === "quit") {
      return {
        ...initialState,
        timerKey: gs.timerKey + 1,
      };
    }
    if (action.type === "timeout") {
      logGameEvent("timeout");
      handleResult(false);
      return {
        ...gs,
        mode: "timeout",
        justStruck: false,
        showAnswer: false,
      };
    }
    if (action.type === "toggle show answer") {
      if (gs.mode === "practice") {
        return {
          ...gs,
          justStruck: false,
          showAnswer: !gs.showAnswer,
        };
      }
      return gs;
    }
    if (action.type === "skip") {
      if (gs.mode === "practice") {
        return {
          ...gs,
          current: getQuestion(),
          justStruck: false,
          showAnswer: false,
        };
      }
      return gs;
    }
    throw new Error("unknown GameReducerAction");
  };

  function dispatch(action: GameReducerAction) {
    setStateDangerous((gs) => gameReducer(gs, action));
  }

  function logGameEvent(action: string) {
    if (isProd && !user?.admin) {
      ReactGA.event({
        category: "Game",
        action: `${action} - ${id}`,
        label: id,
      });
    }
  }
  function punish() {
    if (navigator.vibrate) {
      navigator.vibrate(errorVibration);
    }
  }
  function handleResult(done: boolean) {
    const result: AT.TestResult = {
      done,
      time: getTimestamp(),
      id,
    };
    // add the test to the user object
    if (!user) return;
    setUser((u) => {
      // pure type safety with the prevUser
      if (!u) return u;
      return {
        ...u,
        tests: [...u.tests, result],
      };
    });
    // save the test result in local storage
    saveResult(result, user.userId);
    // try to post the result
    postSavedResults(user.userId)
      .then((r) => {
        if (r === "sent") pullUser();
      })
      .catch(console.error);
  }
  function getProgressWidth(): string {
    const num = !state.current
      ? 0
      : state.mode === "complete"
      ? 100
      : getPercentageDone(state.numberComplete, amount);
    return `${num}%`;
  }
  const progressColor =
    state.mode === "complete"
      ? "success"
      : state.mode === "fail" || state.mode === "timeout"
      ? "danger"
      : "primary";
  const gameRunning = state.mode === "practice" || state.mode === "test";
  function ActionButtons() {
    return (
      <div>
        {!inChapter && (
          <Link to={studyLink}>
            <button className="btn btn-danger mt-4 mx-3">Study</button>
          </Link>
        )}
        <button
          className="btn btn-warning mt-4 mx-3"
          onClick={() => dispatch({ type: "start", payload: "practice" })}
        >
          Practice
        </button>
        <button
          className="btn btn-success mt-4 mx-3"
          onClick={() => dispatch({ type: "start", payload: "test" })}
        >
          Test
        </button>
      </div>
    );
  }
  return (
    <>
      <div
        className="text-center"
        style={{ minHeight: "200px", zIndex: 10, position: "relative" }}
      >
        {(state.mode === "test" || state.mode === "intro") && (
          <div className="progress" style={{ height: "5px" }}>
            <div
              className={`progress-bar bg-${progressColor}`}
              role="progressbar"
              style={{ width: getProgressWidth() }}
            />
          </div>
        )}
        <div className="d-flex flex-row justify-content-between mt-2">
          {state.mode === "test" ? (
            <StrikesDisplay strikes={state.strikes} />
          ) : state.mode === "practice" ? (
            <PracticeStatusDisplay
              correct={state.numberComplete}
              incorrect={state.strikes}
            />
          ) : (
            <div />
          )}
          <div className="d-flex flex-row justify-content-right">
            {state.mode === "test" && (
              <CountdownCircleTimer
                key={state.timerKey}
                isPlaying={gameRunning}
                size={30}
                colors={["#555555", "#F7B801", "#A30000"]}
                colorsTime={[timeLimit, timeLimit * 0.33, 0]}
                strokeWidth={4}
                strokeLinecap="square"
                duration={timeLimit}
                onComplete={() => dispatch({ type: "timeout" })}
              />
            )}
            {state.mode !== "intro" && (
              <button
                onClick={() => dispatch({ type: "quit" })}
                className="btn btn-outline-secondary btn-sm ml-2"
              >
                Quit
              </button>
            )}
          </div>
        </div>
        <div ref={parent}>
          {state.justStruck && (
            <div
              className="alert alert-warning my-2"
              role="alert"
              style={{ maxWidth: "300px", margin: "0 auto" }}
            >
              {getStrikeMessage()}
            </div>
          )}
        </div>
        <Reward
          ref={rewardRef}
          config={{
            lifetime: 130,
            spread: 90,
            elementCount: 150,
            zIndex: 999999999,
          }}
          type="confetti"
        >
          <div className="mb-2">
            {state.mode === "intro" && (
              <div>
                <div className="pt-3">
                  {/* TODO: ADD IN TEXT DISPLAY OPTIONS HERE TOO - WHEN WE START USING THEM*/}
                  <Instructions />
                </div>
                <ActionButtons />
              </div>
            )}
            {gameRunning && (
              <Display
                question={state.current}
                callback={(correct) =>
                  dispatch({
                    type: "handle question response",
                    payload: { correct },
                  })
                }
              />
            )}
            {state.mode === "practice" &&
              (state.justStruck || state.showAnswer) && (
                <div className="my-3">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => dispatch({ type: "toggle show answer" })}
                  >
                    {state.showAnswer ? "Hide" : "Show"} Answer
                  </button>
                </div>
              )}
            {state.showAnswer && state.mode === "practice" && (
              <div className="my-2">
                <div className="my-1">
                  <DisplayCorrectAnswer question={state.current} />
                </div>
                <button
                  className="btn btn-sm btn-primary my-2"
                  onClick={() => dispatch({ type: "skip" })}
                >
                  Next Question
                </button>
              </div>
            )}
            {state.mode === "complete" && (
              <div>
                <h4 className="mt-4">
                  <span role="img" aria-label="celebration">
                    🎉
                  </span>{" "}
                  Finished!
                </h4>
                <button
                  className="btn btn-secondary mt-4"
                  onClick={() => dispatch({ type: "start", payload: "test" })}
                >
                  Try Again
                </button>
              </div>
            )}
            {(state.mode === "timeout" || state.mode === "fail") && (
              <div className="mb-4">
                <h4 className="mt-4">
                  {failMessage({
                    numberComplete: state.numberComplete,
                    amount,
                    type: state.mode,
                  })}
                </h4>
                <div>The correct answer was:</div>
                <div className="my-2">
                  <DisplayCorrectAnswer question={state.current} />
                </div>
                <div className="my-3">
                  <ActionButtons />
                </div>
              </div>
            )}
          </div>
        </Reward>
      </div>
      {gameRunning && (
        <div
          style={{
            position: "absolute",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(10px)",
            top: "0px",
            left: "0px",
            width: "100%",
            height: "100%",
            zIndex: 6,
          }}
        ></div>
      )}
    </>
  );
}

function PracticeStatusDisplay({
  correct,
  incorrect,
}: {
  correct: number;
  incorrect: number;
}) {
  return (
    <div className="d-flex flex-row justify-content-between align-items-center small">
      <div className="mr-3">
        ✅ <samp>Correct: {correct}</samp>
      </div>
      <div>
        ❌ <samp>Incorrect: {incorrect}</samp>
      </div>
    </div>
  );
}

function StrikesDisplay({ strikes }: { strikes: number }) {
  return (
    <div>
      {[...Array(strikes)].map((_) => (
        <span key={Math.random()} className="mr-2">
          ❌
        </span>
      ))}
    </div>
  );
}

function getStrikeMessage() {
  return randFromArray([
    "Not quite! Try again.",
    "No sorry, try again",
    "Umm, no, try again",
    "Try again",
    "Oooooooo, sorry no...",
  ]);
}

function failMessage({
  numberComplete,
  amount,
  type,
}: {
  numberComplete: number;
  amount: number;
  type: "timeout" | "fail";
}): string {
  const pDone = getPercentageDone(numberComplete, amount);
  const { message, face } =
    pDone < 20
      ? { message: "No, sorry", face: "😑" }
      : pDone < 30
      ? { message: "Oops, that's wrong", face: "😟" }
      : pDone < 55
      ? { message: "Fail", face: "😕" }
      : pDone < 78
      ? { message: "You almost got it!", face: "😩" }
      : { message: "Nooo! So close!", face: "😭" };
  return type === "fail" ? `${message} ${face}` : `⏳ Time's Up ${face}`;
}

export default GameCore;
