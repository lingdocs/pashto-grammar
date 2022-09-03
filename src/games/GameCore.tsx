import { useState, useRef, useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Reward, { RewardElement } from 'react-rewards';
import Link from "../components/Link";
import { useUser } from "../user-context";
import "./timer.css";
import {
    getPercentageDone,
} from "../lib/game-utils";
import {
    saveResult,
    postSavedResults,
} from "../lib/game-results";
import {
    AT,
    getTimestamp,
} from "@lingdocs/lingdocs-main";
import {
    randFromArray,
    Types,
} from "@lingdocs/pashto-inflector";
import ReactGA from "react-ga";
import { isProd } from "../lib/isProd";
import autoAnimate from "@formkit/auto-animate";
const errorVibration = 200;

const maxStrikes = 2;

function GameCore<T>({ inChapter, questions, Display, timeLimit, Instructions, studyLink, id }:{
    inChapter: boolean,
    id: string,
    studyLink: string,
    Instructions: (props: { opts?: Types.TextOptions }) => JSX.Element,
    questions: () => QuestionGenerator<T>,
    Display: (props: QuestionDisplayProps<T>) => JSX.Element,
    timeLimit: number;
}) {
    // TODO: report pass with id to user info
    const rewardRef = useRef<RewardElement | null>(null);
    const parent = useRef<HTMLDivElement | null>(null);
    const { user, pullUser, setUser } = useUser();
    const [mode, setMode] = useState<"practice" | "test">("test");
    const [finish, setFinish] = useState<undefined | "pass" | { msg: "fail", answer: JSX.Element } | "time out">(undefined);
    const [strikes, setStrikes] = useState<number>(0);
    const [justStruck, setJustStruck] = useState<boolean>(false);
    const [current, setCurrent] = useState<Current<T> | undefined>(undefined);
    const [questionBox, setQuestionBox] = useState<QuestionGenerator<T>>(questions());
    const [timerKey, setTimerKey] = useState<number>(1);
    useEffect(() => {
        parent.current && autoAnimate(parent.current)
    }, [parent]);

    function logGameEvent(action: string) {
        if (isProd && !(user?.admin)) {
            ReactGA.event({
                category: "Game",
                action: `${action} - ${id}`,
                label: id,
            });
        }
    }

    function handleCallback(correct: true | JSX.Element) {
        if (correct === true) {
            handleAdvance();
            return;
        }
        setStrikes(s => s + 1);
        navigator.vibrate(errorVibration);
        if (strikes < maxStrikes) {
            setJustStruck(true);
        } else {
            logGameEvent("fail on game");
            setJustStruck(false);
            setFinish({ msg: "fail", answer: correct });
            const result: AT.TestResult = {
                done: false,
                time: getTimestamp(),
                id,
            };
            handleResult(result);
        }
    }
    function handleAdvance() {
        setJustStruck(false);
        const next = questionBox.next();
        if (next.done) handleFinish();
        else setCurrent(next.value);
    }
    function handleResult(result: AT.TestResult) {
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
        postSavedResults(user.userId).then((r) => {
            if (r === "sent") pullUser();
        }).catch(console.error);
    }
    function handleFinish() {
        logGameEvent("passed game")
        setFinish("pass");
        rewardRef.current?.rewardMe();
        if (!user) return;
        const result: AT.TestResult = {
            done: true,
            time: getTimestamp(),
            id,
        };
        handleResult(result);
    }
    function handleQuit() {
        setFinish(undefined);
        setCurrent(undefined);
    }
    function handleRestart(mode: "test" | "practice") {
        logGameEvent(`started game ${mode}`);
        setMode(mode);
        const newQuestionBox = questions();
        const { value } = newQuestionBox.next();
        // just for type safety -- the generator will have at least one question
        if (!value) return;
        setQuestionBox(newQuestionBox);
        setJustStruck(false);
        setStrikes(0);
        setFinish(undefined);
        setCurrent(value);
        setTimerKey(prev => prev + 1);
    }
    function handleTimeOut() {
        logGameEvent("timeout on game");
        setJustStruck(false);
        setFinish("time out");
        navigator.vibrate(errorVibration);
        const result: AT.TestResult = {
            done: false,
            time: getTimestamp(),
            id,
        };
        handleResult(result);
    }
    function getProgressWidth(): string {
        const num = !current
            ? 0
            : (finish === "pass")
            ? 100
            : getPercentageDone(current.progress);
        return `${num}%`;
    }
    const progressColor = finish === "pass"
        ? "success"
        : typeof finish === "object"
        ? "danger"
        : "primary";
    const gameRunning = current && finish === undefined;
    function ActionButtons() {
        return <div>
            {!inChapter && <Link to={studyLink}>
                <button className="btn btn-danger mt-4 mx-3">Study</button>
            </Link>}
            <button className="btn btn-warning mt-4 mx-3" onClick={() => handleRestart("practice")}>Practice</button>
            <button className="btn btn-success mt-4 mx-3" onClick={() => handleRestart("test")}>Test</button>
        </div>;
    }
    return <>
        <div className="text-center" style={{ minHeight: "200px", zIndex: 10, position: "relative" }}>
            {mode === "test" && <div className="progress" style={{ height: "5px" }}>
                <div className={`progress-bar bg-${progressColor}`} role="progressbar" style={{ width: getProgressWidth() }} />
            </div>}
            {current && <div className="d-flex flex-row justify-content-between mt-2">
                <StrikesDisplay strikes={strikes} />
                <div className="d-flex flex-row-reverse">
                    {mode === "test" && <CountdownCircleTimer
                        key={timerKey}
                        isPlaying={!!current && !finish}
                        size={30}
                        colors={["#555555", "#F7B801", "#A30000"]}
                        colorsTime={[timeLimit, timeLimit*0.33, 0]}
                        strokeWidth={4}
                        strokeLinecap="square"
                        duration={timeLimit}
                        onComplete={handleTimeOut}
                    />}
                    <button onClick={handleQuit} className="btn btn-outline-secondary btn-sm mr-2">Quit</button>
                </div>
            </div>}
            {mode === "test" && <div ref={parent}>
                {justStruck && <div className="alert alert-warning my-2" role="alert" style={{ maxWidth: "300px", margin: "0 auto" }}>
                    {getStrikeMessage()}
                </div>}
            </div>}
            <Reward ref={rewardRef} config={{ lifetime: 130, spread: 90, elementCount: 150, zIndex: 999999999 }} type="confetti">
                <div>
                    {finish === undefined &&
                        (current 
                            ? <div>
                                <Display question={current.question} callback={handleCallback} />
                            </div>
                            : <div>
                                <div className="pt-3">
                                    {/* TODO: ADD IN TEXT DISPLAY OPTIONS HERE TOO - WHEN WE START USING THEM*/}
                                    <Instructions />
                                </div>
                                <ActionButtons />
                            </div>)
                    }
                    {finish === "pass" && <div>
                        <h4 className="mt-4">
                            <span role="img" aria-label="celebration">🎉</span> Finished!
                        </h4>
                        <button className="btn btn-secondary mt-4" onClick={() => handleRestart("test")}>Try Again</button>
                    </div>}
                    {(typeof finish === "object" || finish === "time out") && <div>
                        {mode === "test" && <h4 className="mt-4">{failMessage(current?.progress, finish)}</h4>}
                        {typeof finish === "object" && <div>
                            <div>The correct answer was:</div>
                            <div className="my-2">
                                {finish?.answer}
                            </div>
                        </div>}
                        <div className="mt-3">
                            <ActionButtons />
                        </div>
                    </div>}
                </div>
            </Reward>
        </div>
        {gameRunning && <div style={{
            position: "absolute",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(10px)",
            top: "0px",
            left: "0px",
            width: "100%",
            height: "100%",
            zIndex: 6,
        }}></div>}
    </>;
}

function StrikesDisplay({ strikes }: { strikes: number }) {
    return <div>
        {[...Array(strikes)].map(_ => <span key={Math.random()} className="mr-2">❌</span>)}
    </div>;
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

function failMessage(progress: Progress | undefined, finish: "time out" | { msg: "fail", answer: JSX.Element }): string {
    const pDone = progress ? getPercentageDone(progress) : 0;
    const { message, face } = pDone < 20
        ? { message: "No, sorry", face: "😑" }
        : pDone < 30
        ? { message: "Oops, that's wrong", face: "😟" }
        : pDone < 55
        ? { message: "Fail", face: "😕" }
        : pDone < 78
        ? { message: "You almost got it!", face: "😩" }
        : { message: "Nooo! So close!", face: "😭" };
    return typeof finish === "object"
        ? `${message} ${face}`
        : `⏳ Time's Up ${face}`;
}

export default GameCore;