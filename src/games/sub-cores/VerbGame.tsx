import { useState } from "react";
import {
    comparePs,
} from "../../lib/game-utils";
import GameCore from "../GameCore";
import {
    Types as T,
    defaultTextOptions as opts,
    makeNounSelection,
    randFromArray,
    flattenLengths,
    randomPerson,
    InlinePs,
    grammarUnits,
    renderVP,
    makeVPSelectionState,
    compileVP,
    blockUtils,
    concatPsString,
    isInvalidSubjObjCombo,
    removeFVarients,
    getEnglishVerb,
    RootsAndStems,
    getVerbInfo,
    defaultTextOptions,
    humanReadableVerbForm,
    blank,
    kidsBlank,
    isPashtoScript,
} from "@lingdocs/pashto-inflector";
import { isPastTense, isThirdPerson } from "@lingdocs/pashto-inflector/dist/lib/phrase-building/vp-tools";
import { maybeShuffleArray } from "../../lib/shuffle-array";
import { getVerbFromBlocks } from "@lingdocs/pashto-inflector/dist/lib/phrase-building/blocks-utils";
import { baParticle } from "@lingdocs/pashto-inflector/dist/lib/grammar-units";
import { intransitivePastVerbs } from "../../content/verbs/basic-present-verbs";
import { makePool } from "../../lib/pool";
import { wordQuery } from "../../words/words";

const kidsColor = "#017BFE";

const amount = 12;
const timeLimit = 140;

type Question = {
    rendered: T.VPRendered,
    phrase: { ps: T.SingleOrLengthOpts<T.PsString[]>, e?: string[] },
};

const transitivePastVerbs = wordQuery("verbs", [
    "leedul",
    "wahul",
    "khoRul",
    "shărmawul",
    "pejzandul",
    "taRul",
]);

const verbs = wordQuery("verbs", [
    "leekul",
    "wahul",
    "leedul",
    "awredul",
    "khoRul",
    "akhistul",
    "katul",
    "lwedul",
]);

const nouns = wordQuery("nouns", [
    "saRey",
    "xudza",
    "maashoom",
    "puxtoon",
    "Ustaaz",
    "DaakTar",
    "halik",
]);

const persons: T.Person[] = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
];

const secondPersons = [
    T.Person.SecondSingMale,
    T.Person.SecondSingFemale,
    T.Person.SecondPlurMale,
    T.Person.SecondPlurFemale,
];

type VerbGameLevel = {
    /* 1 is just a single verb, 2 picks a random verb for every question */
    level: 1 | 2,
    type: "presentVerb" | "subjunctiveVerb"
        | "futureVerb" | "imperative" | "intransitivePerfectivePast"
        | "intransitiveImperfectivePast" | "transitivePerfectivePast" | "transitiveImperfectivePast"
        | "allPast" | "habitualPast" | "allTenses";
}
type VerbPoolName = "basic" | "transitivePast" | "intransitivePast" | "mixedPast" | "mixedAll";

function selectVerbPool({ type }: VerbGameLevel): VerbPoolName {
    return type === "presentVerb"
        ? "basic"
        : type === "futureVerb"
        ? "basic"
        : type === "subjunctiveVerb"
        ? "basic"
        : type === "imperative"
        ? "basic"
        : type === "intransitiveImperfectivePast"
        ? "intransitivePast"
        : type === "intransitivePerfectivePast"
        ? "intransitivePast"
        : type === "transitiveImperfectivePast"
        ? "transitivePast"
        : type === "transitivePerfectivePast"
        ? "transitivePast"
        : type === "habitualPast" || type === "allPast"
        ? "mixedPast"
        : "mixedAll";
}

// TODO: Level where you create the formulas (seperate file)
// level where you choose the right situation

const VerbGame: GameSubCore<VerbGameLevel> = ({ id, link, level, inChapter }: {
    inChapter: boolean,
    id: string,
    link: string,
    level: VerbGameLevel,
 }) => {
    const personPool = makePool(level.type === "imperative"
        ? secondPersons
        : persons
    );
    const verbPools: Record<VerbPoolName, () => T.VerbEntry> = {
        basic: makePool(verbs, 15),
        transitivePast: makePool(transitivePastVerbs, 15),
        intransitivePast: makePool(intransitivePastVerbs, 15),
        mixedPast: makePool([...transitivePastVerbs, ...intransitivePastVerbs], 15),
        mixedAll: makePool([...verbs, ...transitivePastVerbs, ...intransitivePastVerbs], 15),
    };
    const oneVerb: T.VerbEntry = verbPools[selectVerbPool(level)]();
    const getVerb = level.level === 1
        ? () => oneVerb
        : () => verbPools[selectVerbPool(level)]();
    function makeRandomNoun(): T.NounSelection {
        const n = makeNounSelection(randFromArray(nouns), undefined);
        return {
            ...n,
            gender: n.genderCanChange ? randFromArray(["masc", "fem"]) : n.gender,
            number: n.numberCanChange ? randFromArray(["singular", "plural"]) : n.number,
        };
    }
    function makeRandomVPS(tense: T.VerbTense | T.ImperativeTense): T.VPSelectionComplete {
        function personToNPSelection(p: T.Person): T.NPSelection {
            if (isThirdPerson(p)) {
                return {
                    type: "NP",
                    selection: randFromArray([
                        () => makePronounS(p),
                        makeRandomNoun,
                        () => makePronounS(p),
                    ])(),
                };
            }
            return {
                type: "NP",
                selection: makePronounS(p),
            };
        }
        function makePronounS(p: T.Person): T.PronounSelection {
            return {
                type: "pronoun",
                person: p,
                distance: randFromArray(["far", "near", "far"]),
            };
        }
        const verb = getVerb();
        const king = personPool();
        let servant: T.Person;
        do {
            servant = randomPerson();
        } while (isInvalidSubjObjCombo(king, servant));
        return makeVPS({
            verb,
            king: personToNPSelection(king),
            servant: personToNPSelection(servant),
            tense,
            defaultTransitivity: level.type.startsWith("transitive")
                ? "transitive"
                : "grammatically transitive",
        });
    }
    function getQuestion(): Question {
        const VPS = makeRandomVPS(levelToTense(level));
        const VP = renderVP(VPS);
        const compiled = compileVP(
            VP,
            { removeKing: false, shrinkServant: false },
            true,
            { ba: true, verb: true },
        );
        const phrase = {
            ps: compiled.ps,
            e: compiled.e,
        };
        return {
            rendered: VP,
            phrase,
        };
    }

    function Display({ question, callback }: QuestionDisplayProps<Question>) {
        const [answer, setAnswer] = useState<string>("");
        const [withBa, setWithBa] = useState<boolean>(false);
        const handleInput = ({ target: { value }}: React.ChangeEvent<HTMLInputElement>) => {
            if (value === "به " || value === "به ") {
                setWithBa(true);
                setAnswer("");
                return;
            }
            setAnswer(value);
        }
        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const correct = comparePs(answer, getVerbPs(question.rendered))
                && (withBa === verbHasBa(question.rendered));
            if (correct) {
                setAnswer("");
            }
            callback(correct);
        }
        // useEffect(() => {
        //     if (level === "allProduce") setWithBa(false);
        // }, [question]);
        return <div>
            <QuestionDisplay question={question} userAnswer={{
                withBa,
                answer,
            }} />
            <form onSubmit={handleSubmit}>
                <div className="form-check mt-1">
                    <input
                        id="baCheckbox"
                        className="form-check-input"
                        type="checkbox"
                        checked={withBa}
                        onChange={e => setWithBa(e.target.checked)}
                    />
                    <label className="form-check-label text-muted" htmlFor="baCheckbox">
                        with <InlinePs opts={opts}>{grammarUnits.baParticle}</InlinePs> in the <span style={{ color: kidsColor }}>kids' section</span>
                    </label>
                </div>
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
                    {/* <div> */}
                        <button className="btn btn-primary" type="submit">return ↵</button>
                    {/* </div> */}
                    {/* <div className="text-muted small text-center mt-2">
                        Type <kbd>Enter</kbd> to check
                    </div> */}
                </div>
            </form>
        </div>
    }
    
    function Instructions() {
        const desc = levelToDescription(level);
        return <div>
            <p className="lead">
                Write the {desc} verb to complete the phrase
                {desc ? "" : " (all tenses)"}
            </p>
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

export default VerbGame;

function QuestionDisplay({ question, userAnswer }: {
    question: Question,
    userAnswer: { withBa: boolean, answer: string },
}) {
    const ps = addUserAnswer(
        userAnswer,
        flattenLengths(question.phrase.ps)[0]
    );
    const v = getVerbFromBlocks(question.rendered.blocks);
    const vEntry = v.block.verb.entry;
    const infoV = getVerbInfo(vEntry)
    const info = "grammaticallyTransitive" in infoV
        ? infoV.grammaticallyTransitive
        : "stative" in infoV
        ? infoV.stative
        : infoV;
    return <div className="mb-3">
        <div className="mb-2">{vEntry.p} - {removeFVarients(vEntry.f)} "{getEnglishVerb(vEntry)}"</div>
        <details style={{ marginBottom: 0 }}>
            <summary>🌳 Show roots and stems</summary>
            <RootsAndStems info={info} textOptions={defaultTextOptions} />
        </details>
        <div dir="rtl">{ps.p}</div>
        <div dir="ltr">{ps.f}</div>
        {question.phrase.e && <div className="text-muted mt-2">
            {question.phrase.e.map(x => <div key={Math.random()}>
                {x}
            </div>)}
        </div>}
        <div>{humanReadableVerbForm(v.block.tense)}</div>
    </div>;
}

function DisplayCorrectAnswer({ question }: { question: Question }): JSX.Element {
    return <div>
        <div>
            {getVerbPs(question.rendered).reduce(((accum, curr, i): JSX.Element[] => (
                [
                    ...accum,
                    ...i > 0 ? [<span className="text-muted"> or </span>] : [],
                    <span>{curr.p} - {curr.f}</span>,
                ]
            )), [] as JSX.Element[])}
        </div>
        <div><strong>{verbHasBa(question.rendered) ? "with" : "without"}</strong> a <InlinePs opts={opts}>{grammarUnits.baParticle}</InlinePs> in the kids' section.</div>
    </div>;
}
// function modExs(exs: T.PsString[], withBa: boolean): { p: JSX.Element, f: JSX.Element }[] {
//     return exs.map(ps => {
//         if (!ps.p.includes(" ___ ")) {
//             return {
//                 p: <>{ps.p}</>,
//                 f: <>{ps.f}</>,
//             };
//         }
//         const splitP = ps.p.split(" ___ ");
//         const splitF = ps.f.split(" ___ ");
//         return {
//             p: <>{splitP[0]} <span style={{ color: kidsColor }}>{withBa ? "به" : "__"}</span> {splitP[1]}</>,
//             f: <>{splitF[0]} <span style={{ color: kidsColor }}>{withBa ? "ba" : "__"}</span> {splitF[1]}</>,
//         };
//     });
// }

function addUserAnswer(a: { withBa: boolean, answer: string }, ps: T.PsString): T.PsString {
    function addBa(x: T.PsString) {
        if (!a.withBa) return x;
        return {
            p: x.p.replace(kidsBlank.p, baParticle.p),
            f: x.f.replace(kidsBlank.f, baParticle.f),
        }
    }
    function addAnswer(x: T.PsString): T.PsString {
        if (!a.answer) return x;
        const field = isPashtoScript(a.answer) ? "p" : "f";
        return {
            ...x,
            [field]: x[field].replace(blank[field], a.answer),
        };
    }
    return addAnswer(addBa(ps));
}


function levelToDescription({ type }: VerbGameLevel): string {
    return type === "presentVerb"
        ? "present"
        : type === "subjunctiveVerb"
        ? "subjunctive"
        : type === "futureVerb"
        ? "imperfective future or perfective future"
        : type === "intransitivePerfectivePast"
        ? "simple past intransitive"
        : type === "intransitiveImperfectivePast"
        ? "continuous past intransitive"
        : type === "transitiveImperfectivePast"
        ? "continuous past transitive"
        : type === "transitivePerfectivePast"
        ? "simple past transitive"
        : type === "imperative"
        ? "imperfective imperative or perfective imperative"
        : type === "allPast"
        ? "past tense"
        : type === "habitualPast"
        ? "habitual past"
        // : type === "allTenses"
        : "";
}

function levelToTense({ type }: VerbGameLevel): T.VerbTense | T.ImperativeTense {
    return type === "presentVerb"
        ? type
        : type === "subjunctiveVerb"
        ? type
        : type === "futureVerb"
        ? randFromArray(["perfectiveFuture", "imperfectiveFuture"])
        : type === "imperative"
        ? randFromArray(["perfectiveImperative", "imperfectiveImperative"])
        : (type === "intransitiveImperfectivePast" || type === "transitiveImperfectivePast")
        ? "imperfectivePast"
        : (type === "intransitivePerfectivePast" || type === "transitivePerfectivePast")
        ? "perfectivePast"
        : type === "habitualPast"
        ? randFromArray(["habitualPerfectivePast", "habitualImperfectivePast"])
        // : type === "allPast"
        : randFromArray([
            "perfectivePast",
            "imperfectivePast",
            "habitualPerfectivePast",
            "habitualImperfectivePast",
        ]);
}

function makeVPS({ verb, king, servant, tense, defaultTransitivity }: {
    verb: T.VerbEntry,
    king: T.NPSelection,
    servant: T.NPSelection,
    tense: T.VerbTense | T.ImperativeTense,
    defaultTransitivity: "transitive" | "grammatically transitive"
}): T.VPSelectionComplete {
    const vps = makeVPSelectionState(verb);
    const transitivity = (vps.verb.transitivity === "transitive" && vps.verb.canChangeTransitivity)
        ? defaultTransitivity
        : vps.verb.transitivity;
    const ergative = vps.verb.transitivity !== "intransitive" && isPastTense(tense);
    const subject = ergative ? servant : king;
    const object = ergative ? king : servant;
    return {
        ...vps,
        verb: {
            ...vps.verb,
            transitivity,
            tense,
        },
        blocks: maybeShuffleArray([
            {
                key: Math.random(),
                block: {
                    type: "subjectSelection",
                    selection: subject,
                },
            },
            {
                key: Math.random(),
                block: {
                    type: "objectSelection",
                    selection: transitivity === "intransitive"
                        ? "none"
                        : transitivity === "grammatically transitive"
                        ? T.Person.ThirdPlurMale
                        : object,
                },
            },
        ]),
    };
}

function getVerbPs({ blocks }: T.VPRendered): T.PsString[] {
    const { perfectiveHead, verb } = blockUtils.getVerbAndHeadFromBlocks(blocks);
    if (!perfectiveHead) {
        return flattenLengths(verb.block.ps);
    }
    return flattenLengths(verb.block.ps).map(r => concatPsString(perfectiveHead.ps, r));
}

function verbHasBa({ blocks }: T.VPRendered): boolean {
    const verb = blockUtils.getVerbFromBlocks(blocks);
    return verb.block.hasBa;
}