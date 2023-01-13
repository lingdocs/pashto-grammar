import { useState } from "react";
import {
    comparePs,
} from "../../lib/game-utils";
import GameCore from "../GameCore";
import {
    Types as T,
    renderEP,
    compileEP,
    randFromArray,
    defaultTextOptions as opts,
    Examples,
    blank,
    isPashtoScript,
} from "@lingdocs/ps-react";
import { wordQuery } from "../../words/words";
import { makePool } from "../../lib/pool";
import { getPredicateSelectionFromBlocks } from "@lingdocs/ps-react/dist/lib/src/phrase-building/blocks-utils";
import WordCard from "../../components/WordCard";

const amount = 12;
const timeLimit = 140;

const pronouns: T.Person[] = [
    0, 1, 2, 3, 4, 4, 5, 5, 6, 7, 8, 9, 10, 11,
];

const adjectives = wordQuery("adjectives", [
    "muR",
    "sheen",
    "soor",
    "rixtooney",
    "stuRey",
    "ghuT",
    "xu",
    "khufa",
    "takRa",
    "puT",
    "tuGey",
    "koochney",
    "pradey",
    "zoR",
    "moR",
    "khoG",
    "droond",
    "loomRey",
    "Roond",
    "prot",
    "soR",
    "post",
    "pokh",
    "rooN",
    "woR",
    "kooN",
    "koG",
]);

type Question = {
    EPS: T.EPSelectionComplete,
    phrase: { ps: T.PsString[], e?: string[] },
    adjective: T.Rendered<T.AdjectiveSelection>,
};

export default function EPAdjGame({ inChapter, id, link, level }: { inChapter: boolean, id: string, link: string, level: "hints" | "no-hints" }) {
    const pronounPool = makePool(pronouns);
    const adjPool = makePool(adjectives);
    function getQuestion(): Question {
        const subject: T.NPSelection = {
            type: "NP",
            selection: {
                type: "pronoun",
                person: pronounPool(),
                distance: randFromArray(["far", "far", "near"]),
            },
        };
        const EPS = makeEPS(subject, adjPool(), "present");
        const EP = renderEP(EPS);
        const compiled = compileEP(
            EP,
            true,
            { predicate: true },
        );
        const phrase = {
            ps: compiled.ps,
            e: compiled.e,
        };
        return {
            EPS,
            phrase,
            adjective: getAdjectiveFromRendered(EP),
        };
    };
    
    function Display({ question, callback }: QuestionDisplayProps<Question>) {
        const [answer, setAnswer] = useState<string>("");
        const handleInput = ({ target: { value }}: React.ChangeEvent<HTMLInputElement>) => {
            setAnswer(value);
        }
        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const correct = comparePs(answer, question.adjective.ps);
            if (correct) {
                setAnswer("");
            }
            callback(correct);
        }
        
        return <div>
            <div className="mb-2" style={{ maxWidth: "300px", margin: "0 auto" }}>
                <Examples lineHeight={1} opts={opts}>{
                    addUserAnswer(answer, question.phrase.ps[0])
                }</Examples>
                {question.phrase.e && question.phrase.e.map((e, i) => (
                    <div key={e+i} className="text-muted">{e}</div>
                ))}
            </div>
            <div className="d-flex flex-row justify-content-center mb-3">
                <WordCard
                    entry={question.adjective.entry}
                    showHint={level === "hints"}
                    selection={undefined}
                />
            </div>
            <form onSubmit={handleSubmit}>
                <div className="my-1" style={{ maxWidth: "200px", margin: "0 auto" }}>
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
                <div className="text-center my-2">
                    <button className="btn btn-primary" type="submit">submit ↵</button>
                </div>
            </form>
        </div>
    }
    
    function Instructions() {
        return <div>
            <p className="lead">
                Fill in the blank with the correct inflection of the adjective
            </p>
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
    return <div>
        <div>
            {question.adjective.ps.reduce(((accum, curr, i): JSX.Element[] => (
                [
                    ...accum,
                    ...i > 0 ? [<span className="text-muted"> or </span>] : [],
                    <span key={i}>{curr.p}</span>,
                ]
            )), [] as JSX.Element[])}
        </div>
    </div>;
}

function addUserAnswer(a: string, ps: T.PsString): T.PsString {
    if (!a) return ps;
    const field = isPashtoScript(a) ? "p" : "f";
    return {
        ...ps,
        [field]: ps[field].replace(blank[field], a),
    };
}

function getAdjectiveFromRendered(EP: T.EPRendered): T.Rendered<T.AdjectiveSelection> {
    const pred = getPredicateSelectionFromBlocks(EP.blocks);
    if (pred.selection.type !== "complement" || pred.selection.selection.type !== "adjective") {
        throw new Error("adjective not found in predicate");
    }
    return pred.selection.selection;
}

function makeEPS(subject: T.NPSelection, predicate: T.AdjectiveEntry, tense: T.EquativeTense): T.EPSelectionComplete {
    return {
        blocks: [
            {
                key: Math.random(),
                block: {
                    type: "subjectSelection",
                    selection: subject,
                },
            },
        ],
        predicate: {
            type: "predicateSelection",
            selection: {
                type: "complement",
                selection: {
                    type: "adjective",
                    entry: predicate,
                    sandwich: undefined,
                },
            },
        },
        equative: {
            tense,
            negative: false,
        },
        omitSubject: false,
    };
}