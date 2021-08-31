import React, { useState, useRef } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Reward, { RewardElement } from 'react-rewards';
import "./timer.css";
import {
    getPercentageDone,
} from "../lib/game-utils";
const errorVibration = 200;

function Game<T>({ questions, Display, timeLimit, Instructions }: GameInput<T>) {
    const rewardRef = useRef<RewardElement | null>(null);
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
        // post results
        setFinish("pass");
        rewardRef.current?.rewardMe();
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
    return <div className="text-center" style={{ minHeight: "200px" }}>
        <div className="progress" style={{ height: "5px" }}>
            <div className={`progress-bar bg-${progressColor}`} role="progressbar" style={{ width: getProgressWidth() }} />
        </div>
        <div className="d-flex flex-row-reverse mt-2">
            {current && <CountdownCircleTimer
                key={timerKey}
                isPlaying={!!current && !finish}
                size={30}
                strokeWidth={3}
                strokeLinecap="square"
                duration={timeLimit}
                colors="#555555"
                onComplete={handleTimeOut}
            />}
        </div>
        <Reward ref={rewardRef} config={{ lifetime: 130, spread: 90, elementCount: 125 }} type="confetti">
            <div className="py-3">
                {finish === null &&
                    (current 
                        ? <Display question={current.question} callback={handleCallback} />
                        : <div>
                            <div>
                                {/* TODO: ADD IN TEXT DISPLAY OPTIONS HERE TOO - WHEN WE START USING THEM*/}
                                <Instructions />
                            </div>
                            <div>
                                <button className="btn btn-primary mt-4" onClick={handleAdvance}>Start</button>
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
                    <button className="btn btn-secondary mt-4" onClick={handleRestart}>Try Again</button>
                </div>}
            </div>
        </Reward>
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
        ? { message: "You've almost got it!", face: "😩" }
        : { message: "Nooo! So close!", face: "😭" };
    return finish === "fail"
        ? `${message} ${face}`
        : `⏳ Time's Up ${face}`;
}

export default Game;