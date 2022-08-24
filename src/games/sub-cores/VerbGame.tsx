import { useState } from "react";
import {
    comparePs,
    makeProgress,
} from "../../lib/game-utils";
import GameCore from "../GameCore";
import {
    Types as T,
    defaultTextOptions as opts,
    typePredicates as tp,
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
} from "@lingdocs/pashto-inflector";
import { isThirdPerson } from "@lingdocs/pashto-inflector/dist/lib/phrase-building/vp-tools";
import { maybeShuffleArray } from "../../lib/shuffle-array";

const kidsColor = "#017BFE";

const amount = 10;
const timeLimit = 80;

type Question = {
    rendered: T.VPRendered,
    phrase: { ps: T.SingleOrLengthOpts<T.PsString[]>, e?: string[] },
};

const verbs: T.VerbEntry[] = [
    {"ts":1527812856,"i":11630,"p":"لیکل","f":"leekul","g":"leekul","e":"to write, draw","c":"v. trans./gramm. trans.","ec":"write,writes,writing,wrote,written"},
    {"ts":1527815399,"i":14480,"p":"وهل","f":"wahul","g":"wahul","e":"to hit","c":"v. trans.","tppp":"واهه","tppf":"waahu","ec":"hit,hits,hitting,hit,hit"},
    {"ts":1527812275,"i":11608,"p":"لیدل","f":"leedul","g":"leedul","e":"to see","c":"v. trans./gramm. trans.","psp":"وین","psf":"ween","tppp":"لید","tppf":"leed","ec":"see,sees,seeing,saw,seen"},
    {"ts":1577049208257,"i":1068,"p":"اورېدل","f":"awredul","g":"awredul","e":"to hear, listen","c":"v. trans./gramm. trans.","psp":"اور","psf":"awr","tppp":"اورېد","tppf":"awred","ec":"hear,hears,hearing,heard"},
].map(entry => ({ entry })) as T.VerbEntry[];
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

const pronounTypes = [
    [T.Person.FirstSingMale, T.Person.FirstSingFemale],
    [T.Person.SecondSingMale, T.Person.SecondSingFemale],
    [T.Person.ThirdSingMale],
    [T.Person.ThirdSingFemale],
    [T.Person.FirstPlurMale, T.Person.FirstPlurFemale],
    [T.Person.SecondPlurMale, T.Person.SecondPlurFemale],
    [T.Person.ThirdPlurMale, T.Person.ThirdPlurFemale],
];

export default function VerbGame({ id, link, level }: { id: string, link: string, level: T.VerbTense }) {
    function* questions (): Generator<Current<Question>> {
        let pool = [...pronounTypes];
        function getRandPersFromPool(): T.Person {
            let person: T.Person;
            do {
               person = randomPerson();
               // eslint-disable-next-line
            } while (!pool.some(p => p.includes(person)));
            pool = pool.filter(p => !p.includes(person));
            if (pool.length === 0) {
                pool = pronounTypes;
            }
            return person;
        }
        function makeRandomNoun(): T.NounSelection {
            const n = makeNounSelection(randFromArray(nouns), undefined);
            return {
                ...n,
                gender: n.genderCanChange ? randFromArray(["masc", "fem"]) : n.gender,
                number: n.numberCanChange ? randFromArray(["singular", "plural"]) : n.number,
            };
        }
        function makeRandomVPS(l: T.VerbTense): T.VPSelectionComplete {
            function personToNPSelection(p: T.Person): T.NPSelection {
                if (!isThirdPerson(p)) {
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
            const verb = randFromArray(verbs);
            const subj = getRandPersFromPool();
            let obj: T.Person;
            do {
                obj = randomPerson();
            } while (isInvalidSubjObjCombo(subj, obj));
            // const tense = (l === "allIdentify" || l === "allProduce")
            //     ? randFromArray(tenses)
            //     : l;
            const tense = l;
            return makeVPS({
                verb,
                subject: personToNPSelection(subj),
                object: personToNPSelection(obj),
                tense,
            });
        }
        for (let i = 0; i < amount; i++) {
            const VPS = makeRandomVPS(level);
            const VP = renderVP(VPS);
            const compiled = compileVP(
                VP,
                { removeKing: false, shrinkServant: false },
                true,
                "verb",
            );
            const phrase = {
                ps: compiled.ps,
                e: compiled.e,
            };
            yield {
                progress: makeProgress(i, amount),
                question: {
                    rendered: VP,
                    phrase,
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
            if ("situation" in question) {
                return;
            }
            e.preventDefault();
            const correct = comparePs(answer, getVerbPs(question.rendered))
                && (withBa === verbHasBa(question.rendered));
            if (correct) {
                setAnswer("");
            }
            callback(!correct ? makeCorrectAnswer(question) : true);
        }
        // useEffect(() => {
        //     if (level === "allProduce") setWithBa(false);
        // }, [question]);
        return <div>
            <QuestionDisplay question={question} />
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
        return <div>
            <p className="lead">Write the {humanReadableVerbTense(level)} verb to complete the phrase</p>
        </div>
    }

    return <GameCore
        studyLink={link}
        questions={questions}
        id={id}
        Display={Display}
        timeLimit={timeLimit}
        Instructions={Instructions}
    />
};

function QuestionDisplay({ question }: { question: Question }) {
    const ps = flattenLengths(question.phrase.ps)[0];
    return <div className="mb-3">
        <div>{ps.p}</div>
        <div>{ps.f}</div>
        {question.phrase.e && <div className="text-muted mt-2">
            {question.phrase.e.map(x => <div key={Math.random()}>
                {x}
            </div>)}
        </div>}
    </div>;
}

function makeCorrectAnswer(question: Question): JSX.Element {
    return <div>
        <div>
            {getVerbPs(question.rendered).reduce(((accum, curr, i): JSX.Element[] => (
                [
                    ...accum,
                    ...i > 0 ? [<span className="text-muted"> or </span>] : [],
                    <span>{curr.p}</span>,
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


function humanReadableVerbTense(tense: T.VerbTense): string {
    return tense === "presentVerb"
        ? "present"
        : tense === "subjunctiveVerb"
        ? "subjunctive"
        : tense === "imperfectiveFuture"
        ? "imperfective future"
        : tense === "perfectiveFuture"
        ? "perfective future"
        : tense === "perfectivePast"
        ? "simple past"
        : tense === "imperfectivePast"
        ? "continuous past"
        : tense === "habitualImperfectivePast"
        ? "habitual simple past"
        : "habitual continuous past";
}

function makeVPS({ verb, subject, object, tense }: {
    verb: T.VerbEntry,
    subject: T.NPSelection,
    object: T.NPSelection,
    tense: T.VerbTense,
}): T.VPSelectionComplete {
    const vps = makeVPSelectionState(verb);
    const transitivity = (vps.verb.transitivity === "transitive" && vps.verb.canChangeTransitivity)
        ? "grammatically transitive"
        : vps.verb.transitivity;
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