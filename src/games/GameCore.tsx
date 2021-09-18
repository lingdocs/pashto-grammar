import React, { useState, useRef } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Reward, { RewardElement } from 'react-rewards';
import Link from "../components/Link";
import { useUser } from "../user-context";
import "./timer.css";
import {
    getPercentageDone,
} from "../lib/game-utils";
import {
    Types as T,
} from "@lingdocs/pashto-inflector";
const errorVibration = 200;

function GameCore<T>({ questions, Display, timeLimit, Instructions, studyLink, id }:{
    id: string,
    studyLink: string,
    Instructions: (props: { opts?: T.TextOptions }) => JSX.Element,
    questions: () => QuestionGenerator<T>,
    Display: (props: QuestionDisplayProps<T>) => JSX.Element,
    timeLimit: number;
}) {
    // TODO: report pass with id to user info
    const rewardRef = useRef<RewardElement | null>(null);
    const { user } = useUser();
    const [finish, setFinish] = useState<null | "pass" | "fail" | "time out">(null);
    const [current, setCurrent] = useState<Current<T> | undefined>(undefined);
    const [questionBox, setQuestionBox] = useState<QuestionGenerator<T>>(questions());
    const [timerKey, setTimerKey] = useState<number>(1);

    function handleCallback(correct: boolean) {
        if (correct) handleAdvance();
        else handleFailure();
    }
    function handleFailure() {
        // rewardRef.current?.punishMe();
        setFinish("fail");
        navigator.vibrate(errorVibration);
    }
    function handleAdvance() {
        const next = questionBox.next();
        if (next.done) handleFinish();
        else setCurrent(next.value);
    }
    function handleFinish() {
        if (user) {
            // TODO: post results
            console.log(
                "will post results for",
                user.userId,
                "results id",
                id,
            );
        }
        setFinish("pass");
        rewardRef.current?.rewardMe();
    }
    function handleQuit() {
        setFinish(null);
        setCurrent(undefined);
    }
    function handleRestart() {
        const newQuestionBox = questions();
        const { value } = newQuestionBox.next();
        // just for type safety -- the generator will have at least one question
        if (!value) return;
        setQuestionBox(newQuestionBox);
        setFinish(null);
        setCurrent(value);
        setTimerKey(prev => prev + 1);
    }
    function handleTimeOut() {
        setFinish("time out");
        navigator.vibrate(errorVibration);
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
        : finish === "fail"
        ? "danger"
        : "primary";
    return <div>
            <div className="text-center" style={{ minHeight: "200px" }}>
            <div className="progress" style={{ height: "5px" }}>
                <div className={`progress-bar bg-${progressColor}`} role="progressbar" style={{ width: getProgressWidth() }} />
            </div>
            {current && <div className="d-flex flex-row-reverse mt-2">
                <CountdownCircleTimer
                    key={timerKey}
                    isPlaying={!!current && !finish}
                    size={30}
                    strokeWidth={3}
                    strokeLinecap="square"
                    duration={timeLimit}
                    colors="#555555"
                    onComplete={handleTimeOut}
                />
                {!finish && <button onClick={handleQuit} className="btn btn-outline-secondary btn-sm mr-2">Quit</button>}
            </div>}
            <Reward ref={rewardRef} config={{ lifetime: 130, spread: 90, elementCount: 125 }} type="confetti">
                <div className="py-3">
                    {finish === null &&
                        (current 
                            ? <div>
                                <Display question={current.question} callback={handleCallback} />
                            </div>
                            : <div>
                                <div className="pt-3">
                                    {/* TODO: ADD IN TEXT DISPLAY OPTIONS HERE TOO - WHEN WE START USING THEM*/}
                                    <Instructions />
                                </div>
                                <div>
                                    <button className="btn btn-primary mt-4" onClick={handleRestart}>Start</button>
                                </div>
                            </div>)
                    }
                    {finish === "pass" && <div>
                        <h4 className="mt-4">
                            <span role="img" aria-label="celebration">🎉</span> Finished!
                        </h4>
                        <button className="btn btn-secondary mt-4" onClick={handleRestart}>Try Again</button>
                    </div>}
                    {(finish === "fail" || finish === "time out") && <div>
                        <h4 className="mt-4">{failMessage(current?.progress, finish)}</h4>
                        <div>
                            <button className="btn btn-secondary my-4" onClick={handleRestart}>Try Again</button>
                        </div>
                        <div>
                            <Link to={studyLink}>
                                <button className="btn btn-outline-secondary"><span role="img" aria-label="">📚</span> Study more</button>
                            </Link>
                        </div>
                    </div>}
                </div>
            </Reward>
        </div>
    </div>;
}

function failMessage(progress: Progress | undefined, finish: "time out" | "fail"): string {
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
    return finish === "fail"
        ? `${message} ${face}`
        : `⏳ Time's Up ${face}`;
}

export default GameCore;