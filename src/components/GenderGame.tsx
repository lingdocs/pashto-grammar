import React from "react";
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
} from "@lingdocs/pashto-inflector";
import words from "../words/nouns-adjs";
import {
    firstVariation,
} from "../lib/text-tools";

const genders: T.Gender[] = ["masc", "fem"];

// const masc = words.filter((w) => w.entry.c === "n. m.");
// const fem = words.filter((w) => w.entry.c === "n. f.");
type CategorySet = Record<string, { category: string, def: string, entry: T.DictionaryEntry }[]>;
const types: Record<string, CategorySet> = {
    masc: {
        consonantMasc: words.filter((w) => w.category === "consonant-masc"),
        eyMasc: words.filter((w) => w.category === "ey-masc"),
        uMasc: words.filter((w) => w.category === "u-masc"),
        yMasc: words.filter((w) => w.category === "y-masc"),
    },
    fem: {
        aaFem: words.filter((w) => w.category === "aa-fem"),
        eeFem: words.filter((w) => w.category === "ee-fem"),
        uyFem: words.filter((w) => w.category === "uy-fem"),
        aFem: words.filter((w) => w.category === "a-fem"),
        eFem: words.filter((w) => w.category === "e-fem"),  
    },
    // TODO add ې fem words and balance gender
};

const exceptions: Record<string, CategorySet> = {
    masc: {
        exceptionPeopleMasc: words.filter((w) => w.category === "exception-people-masc"),
    },
    fem: {
        consonantFem: words.filter((w) => w.category === "consonant-fem"),
        exceptionPeopleFem: words.filter((w) => w.category === "exception-people-fem"),
    },
}
// consonantFem: words.filter((w) => w.category === "consonant-fem"),

const amount = 40; 

export default function({level}: { level: 1 | 2 }) {
    function* questions () {
        const wordPool = {...types};
        const exceptionsPool = {...exceptions};
        for (let i = 0; i < amount; i++) {
            const base = level === 1
                ? wordPool
                : getRandomFromList([wordPool, exceptionsPool]);
            const gender = getRandomFromList(genders);
            let typeToUse: string;
            do {
                typeToUse = getRandomFromList(Object.keys(base[gender]));
            } while (!base[gender][typeToUse].length);
            const question = getRandomFromList(base[gender][typeToUse]).entry;
            base[gender][typeToUse] = base[gender][typeToUse].filter(({ entry }) => entry.ts !== question.ts);
            yield {
                progress: makeProgress(i, amount),
                question,
            };
        }
    }
    
    function Display({ question, callback }: QuestionDisplayProps<T.DictionaryEntry>) {
        function check(gender: "m" | "f") {
            callback(!!question.c?.includes(gender));
        }
        return <div>
            <div className="mb-4" style={{ fontSize: "larger" }}>
                <Examples opts={opts}>{[
                    {
                        p: firstVariation(question.p),
                        f: firstVariation(question.f),
                        e: level === 2 ? firstVariation(question.e) : undefined,
                    }
                ]}</Examples>
            </div>
            <div className="mt-4">
                <button style={{ background: genderColors.f, color: "black" }} className="btn btn-lg mr-3" onClick={() => check("f")}>Feminine</button>
                <button style={{ background: genderColors.m, color: "black" }} className="btn btn-lg ml-3" onClick={() => check("m")}>Masculine</button>
            </div>
        </div>
    }
    
    function Instructions() {
        return <div>
            <h4>Choose the right gender for each word</h4>
            {level === 2 && <div>⚠ Exceptions included...</div>}
        </div>
    }

    return <Game
        questions={questions}
        Display={Display}
        timeLimit={level === 1 ? 65 : 85}
        Instructions={Instructions}
    />
};
