import {
    getRandomFromList,
    makeProgress,
} from "../../lib/game-utils";
import genderColors from "../../lib/gender-colors";
import GameCore from "../GameCore";
import {
    Types as T,
    Examples,
    defaultTextOptions as opts,
    endsWith,
    pashtoConsonants,
    inflectWord,
    isUnisexSet,
} from "@lingdocs/pashto-inflector";
import { nouns } from "../../words/words";
import {
    firstVariation,
} from "../../lib/text-tools";
import {
    isMascNoun,
    isFemNoun,
    isUnisexNoun,
} from "../../lib/type-predicates";
import { categorize } from "../../lib/categorize";

const genders: T.Gender[] = ["masc", "fem"];

const mascNouns = nouns.filter(isMascNoun);
const femNouns = [
    ...nouns.filter(isFemNoun),
    ...getFemVersions(mascNouns.filter(isUnisexNoun)),
];

const types = {
    masc: categorize<MascNoun, {
        consonantMasc: MascNoun[],
        eyMasc: MascNoun[],
        uMasc: MascNoun[],
        yMasc: MascNoun[],
    }>(mascNouns, {
        consonantMasc: endsWith([{ p: pashtoConsonants }, { p: "و", f: "w" }]),
        eyMasc: endsWith({ p: "ی", f: "ey" }),
        uMasc: endsWith({ p: "ه", f: "u" }),
        yMasc: endsWith([{ p: "ای", f: "aay" }, { p: "وی", f: "ooy" }]),
    }),
    fem: categorize<FemNoun, {
        aaFem: FemNoun[],
        eeFem: FemNoun[],
        uyFem: FemNoun[], 
        aFem: FemNoun[],
        eFem: FemNoun[],  
    }>(femNouns, {
        aaFem: endsWith({ p: "ا", f: "aa" }),
        eeFem: endsWith({ p: "ي", f: "ee" }),
        uyFem: endsWith({ p: "ۍ" }),
        aFem: endsWith([{ p: "ه", f: "a" }, { p: "ح", f: "a" }]),
        eFem: endsWith({ p: "ې" }),
    }),
};

function getFemVersions(uns: UnisexNoun[]): FemNoun[] {
    return uns.map((n) => {
        const infs = inflectWord(n);
        if (!infs || !infs.inflections) return undefined;
        if (!isUnisexSet(infs.inflections)) return undefined;
        return {
            e: n.e,
            ...infs.inflections.fem[0][0],
        } as T.DictionaryEntry;
    }).filter(n => !!n) as FemNoun[];
}

function flatten<T>(o: Record<string, T[]>): T[] {
    return Object.values(o).flat();
}

function nounNotIn(st: Noun[]): (n: Noun | T.DictionaryEntry) => boolean {
    return (n: T.DictionaryEntry) => !st.find(x => x.ts === n.ts);
}

type CategorySet = Record<string, Noun[]>;
// for some reason we need to use this CategorySet type here... 🤷‍♂️
const exceptions: Record<string, CategorySet> = {
    masc: {
        exceptionMasc: mascNouns.filter(nounNotIn(flatten(types.masc))),
    },
    fem: {
        exceptionFem: femNouns.filter(nounNotIn(flatten(types.fem))),
    },
};

const amount = 35;

export default function GenderGame({level, id, link}: { level: 1 | 2, id: string, link: string }) {
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
            const question = getRandomFromList(base[gender][typeToUse]);
            base[gender][typeToUse] = base[gender][typeToUse].filter((entry) => entry.ts !== question.ts);
            yield {
                progress: makeProgress(i, amount),
                question,
            };
        }
    }
    
    function Display({ question, callback }: QuestionDisplayProps<T.DictionaryEntry>) {
        function check(gender: "m" | "f") {
            callback(!nounNotIn(gender === "m" ? mascNouns : femNouns)(question));
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

    return <GameCore
        studyLink={link}
        questions={questions}
        id={id}
        Display={Display}
        timeLimit={level === 1 ? 70 : 80}
        Instructions={Instructions}
    />
};
