import GameCore from "../GameCore";
import {
    Types as T,
    Examples,
    defaultTextOptions as opts,
    randFromArray,
    renderEP,
    compileEP,
} from "@lingdocs/pashto-inflector";
import { psStringEquals } from "@lingdocs/pashto-inflector/dist/lib/p-text-helpers";
import { randomEPSPool } from "./makeRandomEPS";
import { useEffect, useState } from "react";
import classNames from "classnames";

const tenses: T.EquativeTense[] = [
    "present", "habitual", "subjunctive", "future", "past", "wouldBe", "pastSubjunctive", "wouldHaveBeen",
];

const amount = 12;
const timeLimit = 120;

type Question = {
    EPS: T.EPSelectionComplete,
    phrase: T.PsString,
    possibleEquatives: T.EquativeTense[],
};

export default function EquativeIdentify({ inChapter, id, link, level }: { inChapter: boolean, id: string, link: string, level: "allTenses" }) {
    const epsPool = randomEPSPool("allTenses");
    function getQuestion(): Question {
        const EPS = epsPool();
        const EP = renderEP(EPS);
        const compiled = compileEP(EP, true);
        const phrase = randFromArray(compiled.ps);
        return {
            EPS,
            phrase,
            possibleEquatives: getPossibleEquatives(phrase, EPS),
        };
    };
    
    function Display({ question, callback }: QuestionDisplayProps<Question>) {
        console.log({ question });
        const [selected, setSelected] = useState<T.EquativeTense[]>([]);
        useEffect(() => {
            setSelected([]);
        }, [question, setSelected]);
        function handleTenseClick(t: T.EquativeTense) {
            setSelected(s => selected.includes(t)
                ? s.filter(x => x !== t)
                : [...s, t],
            );
        }
        function handleSubmitAnswer() {
            const correct = (
                (selected.length === question.possibleEquatives.length)
                &&
                (question.possibleEquatives.every(e => selected.includes(e)))
            );
            callback(correct);
        }
        
        return <div>
            <div style={{ maxWidth: "300px", margin: "0 auto" }}>
                <Examples opts={opts}>
                    {question.phrase}
                </Examples>
            </div>
            <div className="text-center">
                <div className="small text-muted mb-2">Select all possible tenses</div>
                <div className="row">
                    {tenses.map(t => <div className="col" key={Math.random()}>
                        <button
                            style={{ width: "8rem" }}
                            className={classNames(
                                "btn btn-outline-secondary mb-3",
                                { active: selected.includes(t) },
                            )}
                            onClick={() => handleTenseClick(t)}
                        >
                            {humanReadableTense(t)}
                        </button>
                    </div>)}
                </div>
                <button className="btn btn-primary mb-2" onClick={handleSubmitAnswer}>Submit</button>
            </div>
        </div>
    }
    
    function Instructions() {
        return <div>
            <p className="lead">Identify ALL the possible tenses for each equative phrase you see</p>
        </div>;
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
    return <div className="lead">
        {question.possibleEquatives.map(humanReadableTense).join(" or ")}
    </div>;
}
function getPossibleEquatives(ps: T.PsString, eps: T.EPSelectionComplete): T.EquativeTense[] {
    const possible = tenses.filter(tense => {
        const rendered = renderEP({
            ...eps,
            equative: {
                ...eps.equative,
                tense,
            },
        });
        const compiled = compileEP(rendered, true);
        return compiled.ps.some(x => psStringEquals(x, ps, false));
    });
    if (possible.length === 0) throw new Error("no possible tenses found");
    return possible;
}

function humanReadableTense(tense: T.EquativeTense | "allProduce"): string {
    return tense === "allProduce"
        ? ""
        : tense === "pastSubjunctive"
        ? "past subjunctive"
        : tense === "wouldBe"
        ? `"would be"`
        : tense === "wouldHaveBeen"
        ? `"would have been"`
        : tense;
}
