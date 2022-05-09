import { useState } from "react";
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

const kidsColor = "#017BFE";

// @ts-ignore
const nouns: T.NounEntry[] = [
    {"ts":1527815251,"i":7790,"p":"سړی","f":"saRéy","g":"saRey","e":"man","c":"n. m.","ec":"man","ep":"men"},
    {"ts":1527812797,"i":8605,"p":"ښځه","f":"xúdza","g":"xudza","e":"woman, wife","c":"n. f.","ec":"woman","ep":"women"},
    {"ts":1527812881,"i":11691,"p":"ماشوم","f":"maashoom","g":"maashoom","e":"child, kid","c":"n. m. anim. unisex","ec":"child","ep":"children"},
    {"ts":1527815197,"i":2503,"p":"پښتون","f":"puxtoon","g":"puxtoon","e":"Pashtun","c":"n. m. anim. unisex / adj.","infap":"پښتانه","infaf":"puxtaanu","infbp":"پښتن","infbf":"puxtan"},
    {"ts":1527815737,"i":484,"p":"استاذ","f":"Ustaaz","g":"Ustaaz","e":"teacher, professor, expert, master (in a field)","c":"n. m. anim. unisex anim.","ec":"teacher"},
].filter(tp.isNounEntry);

// @ts-ignore
const adjectives: T.AdjectiveEntry[] = [
    {"ts":1527815306,"i":7582,"p":"ستړی","f":"stúRey","g":"stuRey","e":"tired","c":"adj."},
    {"ts":1527812625,"i":9116,"p":"غټ","f":"ghuT, ghaT","g":"ghuT,ghaT","e":"big, fat","c":"adj."},
    {"ts":1527812792,"i":5817,"p":"خوشاله","f":"khoshaala","g":"khoshaala","e":"happy, glad","c":"adj."},
    {"ts":1527812796,"i":8641,"p":"ښه","f":"xu","g":"xu","e":"good","c":"adj."},
    {"ts":1527812798,"i":5636,"p":"خفه","f":"khúfa","g":"khufa","e":"sad, upset, angry; choked, suffocated","c":"adj."},
].filter(tp.isAdjectiveEntry);

// @ts-ignore
const locAdverbs: T.LocativeAdverbEntry[] = [
    {"ts":1527812558,"i":6241,"p":"دلته","f":"dălta","g":"dalta","e":"here","c":"loc. adv."},
    {"ts":1527812449,"i":13937,"p":"هلته","f":"hálta, álta","g":"halta,alta","e":"there","c":"loc. adv."},
].filter(tp.isLocativeAdverbEntry);

const amount = 20;
const timeLimit = 55;

type Question = {
    phrase: { ps: T.PsString, e?: string[] },
    equative: T.EquativeRendered,
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

export default function EquativeGame({ id, link, tense, onStartStop }: { id: string, link: string, tense: T.EquativeTense, onStartStop: (a: "start" | "stop") => void }) {
    function* questions (): Generator<Current<Question>> {
        let pool = [...pronounTypes];
        function makeRandPronoun(): T.PronounSelection {
            let person: T.Person;
            console.log(pool);
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
        for (let i = 0; i < amount; i++) {
            console.log("one factory call");
            const subj = randFromArray([
                makeRandPronoun,
                makeRandPronoun,
                makeRandomNoun,
                makeRandPronoun,
            ])();
            const pred = randFromArray([...adjectives, ...locAdverbs]);
            const EPS = makeEPS(subj, pred, tense);
            const rendered = renderEP(EPS);
            const compiled = compileEP(rendered, true, { equative: true, ba: false, kidsSection: true });
            const phrase = {
                ps: compiled.ps[0],
                e: compiled.e,
            };
            yield {
                progress: makeProgress(i, amount),
                question: {
                    phrase,
                    equative: rendered.equative,
                },
            };
        };
    }

    
    function Display({ question, callback }: QuestionDisplayProps<Question>) {
        const [answer, setAnswer] = useState<string>("");
        const [withBa, setWithBa] = useState<boolean>(false);
        const handleInput = ({ target: { value }}: React.ChangeEvent<HTMLInputElement>) => {
            setAnswer(value);
        }
        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const given = standardizePashto(answer.trim());
            const correct = checkAnswer(given, question.equative.ps)
                && withBa === question.equative.hasBa;
            if (correct) {
                setAnswer("");
            }
            callback(!correct
                ? <div>
                    <div className="my-2">
                        {flattenLengths(question.equative.ps).reduce(((accum, curr, i): JSX.Element[] => (
                            [
                                ...accum,
                                ...i > 0 ? [<span className="text-muted"> or </span>] : [],
                                <span>{curr.p}</span>,
                            ]
                        )), [] as JSX.Element[])}
                    </div>
                    <div><strong>{question.equative.hasBa ? "with" : "without"}</strong> a <InlinePs opts={opts}>{grammarUnits.baParticle}</InlinePs> in the kids' section.</div>
                </div>
                : true);
        }
        
        return <div>
            <div className="pt-2 pb-1 mb-2" style={{ maxWidth: "300px", margin: "0 auto" }}>
                {/*
                @ts-ignore */}
                <Examples opts={opts} ex={modExs([question.phrase.ps])}></Examples>
                {question.phrase.e && question.phrase.e.map(e => (
                    <div className="text-muted mb-1">{e}</div>
                ))}
            </div>
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
                    <div className="form-check mt-1">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={withBa}
                            onChange={e => setWithBa(e.target.checked)}
                        />
                        <label className="form-check-label text-muted" htmlFor="OSVCheckbox">
                            with <InlinePs opts={opts}>{grammarUnits.baParticle}</InlinePs> in the <span style={{ color: kidsColor }}>kids' section</span>
                        </label>
                    </div>
                    <div className="text-center my-2">
                        {/* <div> */}
                            <button className="btn btn-primary" type="submit">check</button>
                        {/* </div> */}
                        {/* <div className="text-muted small text-center mt-2">
                            Type <kbd>Enter</kbd> to check
                        </div> */}
                    </div>
                </div>
            </form>

        </div>
    }
    
    function Instructions() {
        return <div>
            <p className="lead">Fill in the blank with the correct <strong>{humanReadableTense(tense)} equative</strong> <strong>in Pashto script</strong></p>
        </div>
    }

    return <GameCore
        onStartStop={onStartStop}
        studyLink={link}
        questions={questions}
        id={id}
        Display={Display}
        timeLimit={timeLimit}
        Instructions={Instructions}
    />
};

function modExs(exs: T.PsString[]): { p: JSX.Element, f: JSX.Element }[] {
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
            p: <>{splitP[0]} <span style={{ color: kidsColor }}>___</span> {splitP[1]}</>,
            f: <>{splitF[0]} <span style={{ color: kidsColor }}>___</span> {splitF[1]}</>,
        };
    });
}

function humanReadableTense(tense: T.EquativeTense): string {
    return tense === "pastSubjunctive"
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