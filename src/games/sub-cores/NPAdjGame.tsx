import GameCore from "../GameCore";
import {
    Types as T,
    renderNPSelection,
    getEnglishFromRendered,
    getPashtoFromRendered,
    renderAPSelection,
    InlinePs,
    defaultTextOptions as opts,
    concatPsString,
} from "@lingdocs/ps-react";
import { makeNPAdjGenerator } from "../../lib/block-generators/np-adj-generator";
import { useState } from "react";
import { comparePs } from "../../lib/game-utils";
import WordCard from "../../components/WordCard";
import { makeSandwich } from "../../lib/block-generators/sandwich-generator";

const amount = 14;
const timeLimit = 275;

type Question = {
    selection: T.NPSelection | T.APSelection,
    answer: T.PsString[],
    english: string,
};

type Level = "hints" | "no-hints" | "sandwiches";

const NPAdjWriting: GameSubCore<Level> = ({ inChapter, id, link, level }: {
    inChapter: boolean,
    id: string,
    link: string,
    level: Level,
}) => {
    const npPool = makeNPAdjGenerator(level === "sandwiches" ? "low" : "high");

    function getQuestion(): Question {
        const np = npPool();
        const selection: T.NPSelection | T.APSelection = level === "sandwiches"
            ? makeSandwich(np) : np;
        const rendered: T.Rendered<T.NPSelection> | T.Rendered<T.APSelection> = selection.type === "AP"
            ? renderAPSelection(selection, 0) // WOULD BE CLEANER IF THIS WAS JUST A PURE SANDWICH, NOT AT AP
            : renderNPSelection(np, false, false, "subject", "none", false);
        const answer = getPashtoFromRendered(rendered, false);
        return {
            selection,
            answer,
            english: getEnglishFromRendered(rendered) || "ERROR",
        };
    };
    
    function Display({ question, callback }: QuestionDisplayProps<Question>) {
        const [answer, setAnswer] = useState<string>("");
        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const correct = comparePs(answer, question.answer);
            if (correct) {
                setAnswer("");
            }
            callback(correct);
        }
        if (!(
            (question.selection.type === "AP" && question.selection.selection.type === "sandwich" && question.selection.selection.inside.selection.type === "noun")
            ||
            (question.selection.type === "NP" && question.selection.selection.type === "noun")
        )) {
            throw new Error("QUESTION ERROR - BAD SELECTION")
        }
        const nounSelection: T.NounSelection = question.selection.type === "AP"
            ? question.selection.selection.inside.selection as T.NounSelection // ts being dumb
            : question.selection.selection;
        const adjEntry: T.AdjectiveEntry | undefined = nounSelection.adjectives[0]?.entry;
        if (!adjEntry) {
            throw new Error("QUESTION ERROR - MISSING ADJECTIVE");
        }
        const handleInput = ({ target: { value }}: React.ChangeEvent<HTMLInputElement>) => {
            setAnswer(value);
        }
        const sandwich = question.selection.type === "AP"
            ? question.selection.selection
            : undefined;
        return <div>
            <div className="my-2" style={{ maxWidth: "300px", margin: "0 auto" }}>
                <div className="d-flex flex-row justify-content-center" style={{ gap: "1rem"}}>
                    <WordCard
                        showHint={level === "hints"}
                        entry={adjEntry}
                        selection={undefined}
                    />
                    <WordCard
                        showHint={level === "hints"}
                        entry={nounSelection.entry}
                        selection={nounSelection}
                    />
                </div>
                {sandwich && <div className="mt-2">
                    <InlinePs opts={opts}>
                        {concatPsString(sandwich.before, " ... ", sandwich.after)}
                    </InlinePs>
                </div>}
                <div className="my-3 h5">
                    {question.english}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mt-2 mb-1" style={{ maxWidth: "200px", margin: "0 auto" }}>
                        <input
                            type="text"
                            className="form-control"
                            autoComplete="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            dir="auto"
                            value={answer}
                            onChange={handleInput}
                        />
                    </div>
                    <div className="text-center my-3">
                        <button className="btn btn-primary" type="submit">submit ↵</button>
                    </div>
                </form>
            </div>
        </div>
    }
    
    function Instructions() {
        return <div>
            <p className="lead">Write the {level === "sandwiches" ? "sandwich including the" : ""} adjective and noun together with the proper inflections.</p>
        </div>
    }

    return <GameCore
        inChapter={inChapter}
        studyLink={link}
        getQuestion={getQuestion}
        id={id}
        Display={Display}
        DisplayCorrectAnswer={DisplayCorrectAnswer}
        timeLimit={timeLimit}
        amount={amount}
        Instructions={Instructions}
    />
};

function DisplayCorrectAnswer({ question }: { question: Question }): JSX.Element {
    // TODO: extract this reduces for the or, or different variations, used in VerbGame (etc.?)
    return <div>
        <div>
            {question.answer.reduce(((accum, curr, i): JSX.Element[] => (
                [
                    ...accum,
                    ...i > 0 ? [<span className="text-muted"> or </span>] : [],
                    <span key={i}>{curr.p} - {curr.f}</span>,
                ]
            )), [] as JSX.Element[])}
        </div>
    </div>;
}

export default NPAdjWriting;
