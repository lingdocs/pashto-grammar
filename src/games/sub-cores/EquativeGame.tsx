import { useEffect, useState } from "react";
import {
    makeProgress,
} from "../../lib/game-utils";
import GameCore from "../GameCore";
import {
    Types as T,
    Examples,
    defaultTextOptions as opts,
    standardizePashto,
    typePredicates as tp,
    makeNounSelection,
    randFromArray,
    renderEP,
    compileEP,
    flattenLengths,
    randomPerson,
    InlinePs,
    grammarUnits,
} from "@lingdocs/pashto-inflector";
import { psStringEquals } from "@lingdocs/pashto-inflector/dist/lib/p-text-helpers";

const kidsColor = "#017BFE";

// @ts-ignore
const nouns: T.NounEntry[] = [
    {"ts":1527815251,"i":7790,"p":"سړی","f":"saRéy","g":"saRey","e":"man","c":"n. m.","ec":"man","ep":"men"},
    {"ts":1527812797,"i":8605,"p":"ښځه","f":"xúdza","g":"xudza","e":"woman, wife","c":"n. f.","ec":"woman","ep":"women"},
    {"ts":1527812881,"i":11691,"p":"ماشوم","f":"maashoom","g":"maashoom","e":"child, kid","c":"n. m. anim. unisex","ec":"child","ep":"children"},
    {"ts":1527815197,"i":2503,"p":"پښتون","f":"puxtoon","g":"puxtoon","e":"Pashtun","c":"n. m. anim. unisex / adj.","infap":"پښتانه","infaf":"puxtaanu","infbp":"پښتن","infbf":"puxtan"},
    {"ts":1527815737,"i":484,"p":"استاذ","f":"Ustaaz","g":"Ustaaz","e":"teacher, professor, expert, master (in a field)","c":"n. m. anim. unisex anim.","ec":"teacher"},
    {"ts":1527816747,"i":6418,"p":"ډاکټر","f":"DaakTar","g":"DaakTar","e":"doctor","c":"n. m."},
    {"ts":1527812661,"i":13938,"p":"هلک","f":"halík, halúk","g":"halik,haluk","e":"boy, young lad","c":"n. m. anim."},
].filter(tp.isNounEntry);

// @ts-ignore
const adjectives: T.AdjectiveEntry[] = [
    {"ts":1527815306,"i":7582,"p":"ستړی","f":"stúRey","g":"stuRey","e":"tired","c":"adj."},
    {"ts":1527812625,"i":9116,"p":"غټ","f":"ghuT, ghaT","g":"ghuT,ghaT","e":"big, fat","c":"adj."},
    {"ts":1527812792,"i":5817,"p":"خوشاله","f":"khoshaala","g":"khoshaala","e":"happy, glad","c":"adj."},
    {"ts":1527812796,"i":8641,"p":"ښه","f":"xu","g":"xu","e":"good","c":"adj."},
    {"ts":1527812798,"i":5636,"p":"خفه","f":"khúfa","g":"khufa","e":"sad, upset, angry; choked, suffocated","c":"adj."},
    {"ts":1527822049,"i":3610,"p":"تکړه","f":"takRá","g":"takRa","e":"strong, energetic, skillful, great, competent","c":"adj."},
    {"ts":1527815201,"i":2240,"p":"پټ","f":"puT","g":"puT","e":"hidden","c":"adj."},
    {"ts":1527815381,"i":3402,"p":"تږی","f":"túGey","g":"tugey","e":"thirsty","c":"adj."},
    {"ts":1527812822,"i":10506,"p":"کوچنی","f":"koochnéy","g":"koochney","e":"little, small; child, little one","c":"adj. / n. m. anim. unisex"},
    {"ts":1527815451,"i":7243,"p":"زوړ","f":"zoR","g":"zoR","e":"old","c":"adj. irreg.","infap":"زاړه","infaf":"zaaRu","infbp":"زړ","infbf":"zaR"},
    {"ts":1527812927,"i":12955,"p":"موړ","f":"moR","g":"moR","e":"full, satisfied, sated","c":"adj. irreg.","infap":"ماړه","infaf":"maaRu","infbp":"مړ","infbf":"maR"},
].filter(tp.isAdjectiveEntry);

// @ts-ignore
const locAdverbs: T.LocativeAdverbEntry[] = [
    {"ts":1527812558,"i":6241,"p":"دلته","f":"dălta","g":"dalta","e":"here","c":"loc. adv."},
    {"ts":1527812449,"i":13937,"p":"هلته","f":"hálta, álta","g":"halta,alta","e":"there","c":"loc. adv."},
].filter(tp.isLocativeAdverbEntry);
const tenses: T.EquativeTense[] = [
    "present", "habitual", "subjunctive", "future", "past", "wouldBe", "pastSubjunctive",
];

type Situation = {
    description: string | JSX.Element,
    tense: T.EquativeTense[],
};
const situations: Situation[] = [
    {
        description: <>A is B, for sure, right now</>,
        tense: ["present"],
    },
    {
        description: <>A is <em>probably</em> B, right now</>,
        tense: ["future"],
    },
    {
        description: <>A will be B in the future</>,
        tense: ["future"],
    },
    {
        description: <>We can assume that A is most likely B</>,
        tense: ["future"],
    },
    {
        description: <>You <em>know</em> A is B, currently</>,
        tense: ["present"],
    },
    {
        description: <>A tends to be B</>,
        tense: ["habitual"],
    },
    {
        description: <>A is usually B</>,
        tense: ["habitual"],
    },
    {
        description: <>A is generally B</>,
        tense: ["habitual"],
    },
    {
        description: <>A is B, right now</>,
        tense: ["present"],
    },
    {
        description: <>A is always B, as a matter of habit</>,
        tense: ["present"],
    },
    {
        description: "It's a good thing for A to be B",
        tense: ["subjunctive"],
    },
    {
        description: "A needs to be B (out of obligation/necessity)",
        tense: ["subjunctive"],
    },
    {
        description: "You hope that A is B",
        tense: ["subjunctive"],
    },
    {
        description: "You desire A to be B",
        tense: ["subjunctive"],
    },
    {
        description: "If A is B ...",
        tense: ["subjunctive"],
    },
    {
        description: "...so that A will be B (a purpose)",
        tense: ["subjunctive"],
    },
    {
        description: "A was definately B",
        tense: ["past"],
    },
    {
        description: "A was B",
        tense: ["past"],
    },
    {
        description: "A was probably B in the past",
        tense: ["wouldBe"],
    },
    {
        description: "A used to be B (habitually, repeatedly)",
        tense: ["wouldBe"],
    },
    {
        description: "assume that A would have probably been B",
        tense: ["wouldBe"],
    },
    {
        description: "under different circumstances, A would have been B",
        tense: ["wouldBe", "pastSubjunctive"],
    },
    {
        description: "You wish A were B (but it's not)",
        tense: ["pastSubjunctive"],
    },
    {
        description: "If A were B (but it's not)",
        tense: ["pastSubjunctive"],
    },
    {
        description: "Aaagh! If only A were B!",
        tense: ["pastSubjunctive"],
    },
    {
        description: "A should have been B!",
        tense: ["pastSubjunctive", "wouldBe"],
    },
];

const amount = 17;
const timeLimit = 90;

type Question = {
    EPS: T.EPSelectionComplete,
    phrase: { ps: T.PsString[], e?: string[] },
    equative: T.EquativeRendered,
} | {
    situation: Situation,
};

const pronounTypes = [
    [T.Person.FirstSingMale, T.Person.FirstSingFemale],
    [T.Person.SecondSingMale, T.Person.SecondSingFemale],
    [T.Person.ThirdSingMale],
    [T.Person.ThirdSingFemale],
    [T.Person.FirstPlurMale, T.Person.FirstPlurFemale],
    [T.Person.SecondPlurMale, T.Person.SecondPlurFemale],
    [T.Person.ThirdPlurMale, T.Person.ThirdPlurFemale],
];

export default function EquativeGame({ id, link, level }: { id: string, link: string, level: T.EquativeTense | "allProduce" | "allIdentify" | "situations" }) {
    function* questions (): Generator<Current<Question>> {
        let pool = [...pronounTypes];
        let situationPool = [...situations];
        function makeRandPronoun(): T.PronounSelection {
            let person: T.Person;
            do {
               person = randomPerson();
               // eslint-disable-next-line
            } while (!pool.some(p => p.includes(person)));
            pool = pool.filter(p => !p.includes(person));
            if (pool.length === 0) {
                pool = pronounTypes;
            }
            return {
                type: "pronoun",
                distance: "far",
                person,
            };
        }
        function makeRandomNoun(): T.NounSelection {
            const n = makeNounSelection(randFromArray(nouns), undefined);
            return {
                ...n,
                gender: n.genderCanChange ? randFromArray(["masc", "fem"]) : n.gender,
                number: n.numberCanChange ? randFromArray(["singular", "plural"]) : n.number,
            };
        }
        function makeRandomEPS(l: T.EquativeTense | "allIdentify" | "allProduce"): T.EPSelectionComplete {
            const subj = randFromArray([
                makeRandPronoun,
                makeRandPronoun,
                makeRandomNoun,
                makeRandPronoun,
            ])();
            const pred = randFromArray([...adjectives, ...locAdverbs]);
            const tense = (l === "allIdentify" || l === "allProduce")
                ? randFromArray(tenses)
                : l;
            return makeEPS(subj, pred, tense);
        }
        for (let i = 0; i < amount; i++) {
            if (level === "situations") {
                const picked = randFromArray(situationPool);
                situationPool = situationPool.filter(x => picked.description !== x.description);
                if (situationPool.length === 0) situationPool = [...situations];
                yield {
                    progress: makeProgress(i, amount),
                    question: {
                        situation: picked,
                    },
                };
            } else {
                const EPS = makeRandomEPS(level);
                const EP = renderEP(EPS);
                const compiled = compileEP(
                    EP,
                    true,
                    level === "allIdentify" ? undefined : { equative: true, kidsSection: true },
                );
                const phrase = {
                    ps: compiled.ps,
                    e: level === "allIdentify" ? undefined : compiled.e,
                };
                yield {
                    progress: makeProgress(i, amount),
                    question: {
                        EPS,
                        phrase,
                        equative: EP.equative,
                    },
                };
            }
        };
    }

    
    function Display({ question, callback }: QuestionDisplayProps<Question>) {
        const [answer, setAnswer] = useState<string>("");
        const [withBa, setWithBa] = useState<boolean>(false);
        const handleInput = ({ target: { value }}: React.ChangeEvent<HTMLInputElement>) => {
            setAnswer(value);
        }
        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            if ("situation" in question) {
                return;
            }
            e.preventDefault();
            const given = standardizePashto(answer.trim());
            const correct = checkAnswer(given, question.equative.ps)
                && withBa === question.equative.hasBa;
            if (correct) {
                setAnswer("");
            }
            callback(!correct ? makeCorrectAnswer(question) : true);
        }
        const handleTenseIdentify = (tense: T.EquativeTense) => {
            if ("situation" in question) {
                const wasCorrect = question.situation.tense.includes(tense);
                if (wasCorrect) {
                    callback(true);
                } else {
                    callback(makeCorrectAnswer(question));
                }
                return;
            }
            const renderedWAnswer = renderEP({
                ...question.EPS,
                equative: {
                    ...question.EPS.equative,
                    tense,
                },
            });
            const compiledWAnswer = compileEP(renderedWAnswer, true);
            const wasCorrect = compiledWAnswer.ps.some(a => (
                question.phrase.ps.some(b => psStringEquals(a, b))
            ));
            if (wasCorrect) {
                return callback(wasCorrect);
            } else {
                const possibleCorrect = tenses.filter(tn => {
                    const r = renderEP({
                        ...question.EPS,
                        equative: {
                            ...question.EPS.equative,
                            tense: tn,
                        },
                    });
                    const c = compileEP(r, true);
                    return c.ps.some(a => (
                        question.phrase.ps.some(b => psStringEquals(a, b))
                    ));
                });
                callback(<div className="lead">
                    {possibleCorrect.map(humanReadableTense).join(" or ")}
                </div>)
            }
        }
        useEffect(() => {
            if (level === "allProduce") setWithBa(false);
        }, [question]);
        
        return <div>
            {(level === "allIdentify" || level === "situations") ?
                <div className="mb-2" style={{ maxWidth: "300px", margin: "0 auto" }}>
                    {"situation" in question ? <p className="lead">
                        {question.situation.description}
                    </p> : <Examples opts={opts}>
                        {randFromArray(question.phrase.ps)}
                    </Examples>}
                </div>
                : !("situation" in question) && <div className="mb-2" style={{ maxWidth: "300px", margin: "0 auto" }}>
                    <Examples lineHeight={1} opts={opts}>
                        {/* @ts-ignore  TODO: REMOVE AS P_INFLE */}
                        {modExs(question.phrase.ps, withBa)[0]}
                    </Examples>
                    {question.phrase.e && question.phrase.e.map((e, i) => (
                        <div key={e+i} className="text-muted">{e}</div>
                    ))}
                    <div>{humanReadableTense(question.EPS.equative.tense)} equative</div>
                </div>
            }
            {level === "allIdentify" || "situation" in question ? <div className="text-center">
                <div className="row">
                    {tenses.map(t => <div className="col" key={Math.random()}>
                        <button
                            style={{ width: "8rem" }}
                            className="btn btn-outline-secondary mb-3"
                            onClick={() => handleTenseIdentify(t)}
                        >
                            {humanReadableTense(t)}
                        </button>
                    </div>)}
                </div>
            </div> : <form onSubmit={handleSubmit}>
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
            </form>}
        </div>
    }
    
    function Instructions() {
        return <div>
            {level === "allIdentify"
                ? <p className="lead">Identify a correct tense for each equative phrase you see</p>
                : level === "situations"
                ? <p className="lead">Choose the right type of equative for each given situation</p>
                : <p className="lead">Fill in the blank with the correct <strong>{humanReadableTense(level)} equative</strong> <strong>in Pashto script</strong></p>}
            {level === "allProduce" && <div>⚠ All tenses included...</div>}
        </div>
    }

    return <GameCore
        studyLink={link}
        questions={questions}
        id={id}
        Display={Display}
        timeLimit={level === "allProduce" ? timeLimit * 1.4 : timeLimit}
        Instructions={Instructions}
    />
};

function makeCorrectAnswer(question: Question): JSX.Element {
    if ("situation" in question) {
        return <div>
            {question.situation.tense.map(humanReadableTense).join(" or ")}
        </div>;
    }
    return <div>
        <div>
            {flattenLengths(question.equative.ps).reduce(((accum, curr, i): JSX.Element[] => (
                [
                    ...accum,
                    ...i > 0 ? [<span className="text-muted"> or </span>] : [],
                    <span>{curr.p}</span>,
                ]
            )), [] as JSX.Element[])}
        </div>
        <div><strong>{question.equative.hasBa ? "with" : "without"}</strong> a <InlinePs opts={opts}>{grammarUnits.baParticle}</InlinePs> in the kids' section.</div>
    </div>;
}
function modExs(exs: T.PsString[], withBa: boolean): { p: JSX.Element, f: JSX.Element }[] {
    return exs.map(ps => {
        if (!ps.p.includes(" ___ ")) {
            return {
                p: <>{ps.p}</>,
                f: <>{ps.f}</>,
            };
        }
        const splitP = ps.p.split(" ___ ");
        const splitF = ps.f.split(" ___ ");
        return {
            p: <>{splitP[0]} <span style={{ color: kidsColor }}>{withBa ? "به" : "__"}</span> {splitP[1]}</>,
            f: <>{splitF[0]} <span style={{ color: kidsColor }}>{withBa ? "ba" : "__"}</span> {splitF[1]}</>,
        };
    });
}

function humanReadableTense(tense: T.EquativeTense | "allProduce"): string {
    return tense === "allProduce"
        ? ""
        : tense === "pastSubjunctive"
        ? "past subjunctive"
        : tense === "wouldBe"
        ? `"would be"`
        : tense;
}

function checkAnswer(given: string, answer: T.SingleOrLengthOpts<T.PsString[]>): boolean {
    const possible = flattenLengths(answer);
    return possible.some(x => given === x.p);
}

function makeEPS(subject: T.NPSelection, predicate: T.AdjectiveEntry | T.LocativeAdverbEntry, tense: T.EquativeTense): T.EPSelectionComplete {
    return {
        subject,
        predicate: {
            type: "Complement",
            selection: tp.isAdjectiveEntry(predicate) ? {
                type: "adjective",
                entry: predicate,
            } : {
                type: "loc. adv.",
                entry: predicate,
            },
        },
        equative: {
            tense,
            negative: false,
        },
        omitSubject: false,
    };
}