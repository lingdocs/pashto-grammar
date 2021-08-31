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
    removeFVariants,
} from "@lingdocs/pashto-inflector";
import words from "../words/nouns-adjs";

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
// consonantFem: words.filter((w) => w.category === "consonant-fem"),

const amount = 40; 

function* questions () {
    const wordPool = {...types};
    for (let i = 0; i < amount; i++) {
        const gender = getRandomFromList(Object.keys(wordPool));
        const typeToUse = getRandomFromList(Object.keys(wordPool[gender]));
        const question = getRandomFromList(wordPool[gender][typeToUse]).entry;
        wordPool[gender][typeToUse] = wordPool[gender][typeToUse].filter(({ entry }) => entry.ts !== question.ts);
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
        <div className="mb-4">
            <Examples opts={opts}>{[
                removeFVariants({ p: question.p, f: question.f })
            ]}</Examples>
        </div>
        <div className="mt-4">
            <button style={{ background: genderColors.f, color: "black" }} className="btn btn-lg mr-3" onClick={() => check("f")}>Feminine</button>
            <button style={{ background: genderColors.m, color: "black" }} className="btn btn-lg ml-3" onClick={() => check("m")}>Masculine</button>
        </div>
    </div>
}

function Instructions() {
    return <h4>
       Choose the right gender for each word 
    </h4>;
}

export default function() {
    return <Game questions={questions} Display={Display} timeLimit={65} Instructions={Instructions} />
};
