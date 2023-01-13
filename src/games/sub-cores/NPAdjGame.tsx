import GameCore from "../GameCore";
import {
    Types as T,
    renderNPSelection,
    getEnglishFromRendered,
    concatPsString,
} from "@lingdocs/ps-react";
import { makeNPAdjGenerator } from "../../lib/np-adj-generator";
import { useState } from "react";
import { comparePs } from "../../lib/game-utils";
import WordCard from "../../components/WordCard";

const amount = 15;
const timeLimit = 230;

type Question = {
    selection: T.NPSelection,
    answer: T.PsString[],
    english: string,
};

type Level = "hints" | "no-hints";

// LEVELS
//  - without plurals
//  - with inflection category hinting

const NPAdjWriting: GameSubCore<Level> = ({ inChapter, id, link, level }: {
    inChapter: boolean,
    id: string,
    link: string,
    level: Level,
}) => {
    const npPool = makeNPAdjGenerator();

    function getQuestion(): Question {
        const np = npPool();
        const rendered = renderNPSelection(np, false, false, "subject", "none", false);
        const renderedAdj: T.Rendered<T.AdjectiveSelection> | undefined = rendered.selection.adjectives && rendered.selection.adjectives[0];
        if (!renderedAdj) {
            throw new Error("error getting rendered adjective");
        }
        const answer = renderedAdj.ps.flatMap((adjPs) => (
            rendered.selection.ps.map((nounPs) => (
                concatPsString(adjPs, " ", nounPs)
            ))
        ));
        return {
            selection: np,
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
        if (question.selection.type !== "NP" || question.selection.selection.type !== "noun") {
            throw new Error("QUESTION ERROR");
        }
        const nounEntry = question.selection.selection.entry;
        const adjEntry: T.AdjectiveEntry | undefined = question.selection.selection.adjectives[0]?.entry;
        if (!adjEntry) {
            throw new Error("QUESTION ERROR - MISSING ADJECTIVE");
        }
        const handleInput = ({ target: { value }}: React.ChangeEvent<HTMLInputElement>) => {
            setAnswer(value);
        }
        return <div>
            <div className="my-2" style={{ maxWidth: "300px", margin: "0 auto" }}>
                <div className="d-flex flex-row justify-content-center">
                    <WordCard
                        showHint={level === "hints"}
                        entry={adjEntry}
                        selection={undefined}
                    />
                    <WordCard
                        showHint={level === "hints"}
                        entry={nounEntry}
                        selection={question.selection.selection}
                    />
                </div>
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
            <p className="lead">Write the adjective and noun together with the proper inflections.</p>
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
