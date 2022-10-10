import GameCore from "../GameCore";
import {
    humanReadableVerbForm,
    Types as T,
} from "@lingdocs/ps-react";
import { makePool } from "../../lib/pool";

const tenses: T.VerbTense[] = [
    "presentVerb",
    "subjunctiveVerb",
    "imperfectiveFuture",
    "perfectiveFuture",
    "imperfectivePast",
    "perfectivePast",
    "habitualImperfectivePast",
    "habitualPerfectivePast",
];

type Situation = {
    description: string | JSX.Element,
    tense: T.VerbTense[],
};

const amount = 12;
const timeLimit = 100;

const situations: Situation[] = [
    {
        description: "Something happens generally",
        tense: ["presentVerb"],
    },
    {
        description: "Something is happening right now",
        tense: ["presentVerb"],
    },
    {
        description: "Something is definately about to happen soon",
        tense: ["presentVerb", "imperfectiveFuture", "perfectiveFuture"],
    },
    {
        description: "...so that something happens",
        tense: ["subjunctiveVerb"],
    },
    {
        description: "something should happen (judgement/necessity)",
        tense: ["subjunctiveVerb"],
    },
    {
        description: "you hope that something happens",
        tense: ["subjunctiveVerb"],
    },
    {
        description: "something will happen",
        tense: ["imperfectiveFuture", "perfectiveFuture"],
    },
    {
        description: "an action will happen, and be ongoing",
        tense: ["imperfectiveFuture"],
    },
    {
        description: "an action will happen, and it will just be a one-time, complete action",
        tense: ["perfectiveFuture"],
    },
    {
        description: "something happened",
        tense: ["perfectivePast"],
    },
    {
        description: "something was happening",
        tense: ["imperfectivePast"],
    },
    {
        description: "something was going to happen (but it didn't)",
        tense: ["imperfectivePast"],
    },
    {
        description: "something would have happened",
        tense: ["imperfectivePast", "habitualImperfectivePast"],
    },
    {
        description: "something would happen, again and again in the past",
        tense: ["imperfectivePast", "habitualImperfectivePast", "habitualPerfectivePast"],
    },
    {
        description: "an event was completed, one-time, in the past",
        tense: ["perfectivePast"],
    },
    {
        description: "something would happen habitually in the past - and each time it was a whole/complete event",
        tense: ["habitualPerfectivePast"],
    },
    {
        description: "something would happen habitually in the past - and each time it was ongoing/like an action in process",
        tense: ["habitualImperfectivePast"],
    },
];

type Question = Situation;


export default function VerbSituations({ inChapter, id, link, level }: { inChapter: boolean, id: string, link: string, level: "situations" }) {
    const situationsPool = makePool(situations);
    function getQuestion(): Question {
        return situationsPool();
    };
    
    function Display({ question, callback }: QuestionDisplayProps<Question>) {

        function handleTenseClick(t: T.VerbTense) {
            callback(question.tense.includes(t));
        }
        return <div>
            <div className="my-4" style={{ maxWidth: "300px", margin: "0 auto" }}>
                <p className="lead">
                    {question.description}
                </p>
            </div>
            <div className="text-center">
                <div className="row">
                    {tenses.map(t => <div className="col" key={Math.random()}>
                        <button
                            style={{ width: "8rem" }}
                            className="btn btn-outline-secondary mb-3"
                            onClick={() => handleTenseClick(t)}
                        >
                            {humanReadableVerbForm(t)}
                        </button>
                    </div>)}
                </div>
            </div>
        </div>
    }
    
    function Instructions() {
        return <p className="lead">Choose a verb tense that works for each given situation</p>;
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

    // callback(<div className="lead">
    //     {possibleCorrect.map(humanReadableTense).join(" or ")}
    // </div>)
    return <div>
        {question.tense.map(humanReadableVerbForm).join(" or ")}
    </div>;
}

