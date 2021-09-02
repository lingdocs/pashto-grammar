import React, { useState } from "react";
import {
    getRandomFromList,
    makeProgress,
} from "../lib/game-utils";
import genderColors from "../lib/gender-colors";
import Game from "./Game";
import {
    Types as T,
    Examples,
    defaultTextOptions as opts,
    inflectWord,
    standardizePashto,
    removeAccents,
    // pashtoConsonants,
} from "@lingdocs/pashto-inflector";
import words from "../words/nouns-adjs";
import {
    firstVariation,
} from "../lib/text-tools";

const nouns = words.filter((w) => w.category === "nouns-unisex").map(x => x.entry);
// type NType = "consonant" | "eyUnstressed" | "eyStressed" | "pashtun" | "withu"
// const types: Record<NType, T.DictionaryEntry[]>  = {
//     consonant: nouns.filter((w) => pashtoConsonants.includes(w.p.slice(-1))),
//     eyUnstressed: nouns.filter((w) => w.f.slice(-2) === "ey"),
//     eyStressed: nouns.filter((w) => w.f.slice(-2) === "éy"),
//     pashtun: nouns.filter((w) => w.infaf?.includes("aa")),
//     withu: nouns.filter((w) => w.infaf?.slice(-1) === "u" && !!w.infaf?.includes("aa")),
// }
const genders: T.Gender[] = ["masc", "fem"];

const amount = 20; 

type Question = { entry: T.DictionaryEntry, gender: T.Gender };

export default function() {
    function* questions (): Generator<Current<Question>> {
        let pool = [...nouns];
        for (let i = 0; i < amount; i++) {
            // const keys = Object.keys(types) as NType[];
            // let type: NType
            // do {
            //     type = getRandomFromList(keys);
            // } while (!pool[type].length);
            const entry = getRandomFromList(pool);
            const gender = getRandomFromList(genders) as T.Gender;
            pool = pool.filter((x) => x.ts !== entry.ts);
            yield {
                progress: makeProgress(i, amount),
                question: {
                    entry,
                    gender,
                },
            };
        }
    }
    
    function Display({ question, callback }: QuestionDisplayProps<Question>) {
        function flipGender(g: T.Gender): T.Gender {
            return g === "masc" ? "fem" : "masc";
        }
        const [answer, setAnswer] = useState<string>("");
        const inflected = inflectWord(question.entry) as T.UnisexInflections;
        const givenGender = question.gender === "masc" ? "masculine" : "feminine";
        const requiredGender = question.gender === "fem" ? "masculine" : "feminine";
        if (!inflected || !inflected.masc || !inflected.fem) {
            return <div>WORD ERROR</div>;
        }
        function handleInput({ target: { value }}: React.ChangeEvent<HTMLInputElement>) {
            setAnswer(value);
        }
        function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
            e.preventDefault();
            const given = standardizePashto(answer.trim());
            const correct = inflected[flipGender(question.gender)][0].some((ps) => (
                (given === ps.p) || (removeAccents(given) === removeAccents(ps.f))
            ));
            if (correct) {
                setAnswer("");
            }
            callback(correct);
        }
        
        return <div>
            <div className="pt-2 pb-1 mb-2" style={{ maxWidth: "300px", margin: "0 auto", backgroundColor: genderColors[question.gender === "masc" ? "m" : "f"]}}>
                <Examples opts={opts}>{[
                    {
                        ...inflected[question.gender][0][0],
                        e: firstVariation(question.entry.e),
                    }
                ]}</Examples>
            </div>
            <div>Is {givenGender}. Make it <span style={{ background: genderColors[requiredGender === "masculine" ? "m" : "f"]}}>{requiredGender}</span>.</div>
            <form onSubmit={handleSubmit}>
                <div className="my-3" style={{ maxWidth: "200px", margin: "0 auto" }}>
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
                <div>
                    <button type="submit" className="btn btn-primary">Check</button>
                </div>
            </form>

        </div>
    }
    
    function Instructions() {
        return <div>
            Change the gender of a given word
        </div>
    }

    return <Game
        questions={questions}
        Display={Display}
        timeLimit={150}
        Instructions={Instructions}
    />
};
