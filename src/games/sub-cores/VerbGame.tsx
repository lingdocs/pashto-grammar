import { useEffect, useState } from "react";
import {
    comparePs,
    makeProgress,
} from "../../lib/game-utils";
import GameCore from "../GameCore";
import {
    Types as T,
    Examples,
    defaultTextOptions as opts,
    typePredicates as tp,
    makeNounSelection,
    randFromArray,
    renderEP,
    compileEP,
    flattenLengths,
    randomPerson,
    InlinePs,
    grammarUnits,
    randomSubjObj,
    renderVP,
    makeVPSelectionState,
    compileVP,
    blockUtils,
    concatPsString,
} from "@lingdocs/pashto-inflector";
import { basicVerbs, intransitivePast } from "../../content/verbs/basic-present-verbs";
import { psStringEquals } from "@lingdocs/pashto-inflector/dist/lib/p-text-helpers";

const kidsColor = "#017BFE";

const amount = 10;
const timeLimit = 80;

type Question = {
    rendered: T.VPRendered,
    phrase: { ps: T.SingleOrLengthOpts<T.PsString[]>, e?: string[] },
};

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
        function makeRandomVPS(l: T.VerbTense): T.VPSelectionComplete {
            function makePronoun(p: T.Person): T.PronounSelection {
                return {
                    type: "pronoun",
                    person: p,
                    distance: "far",
                };
            }
            function makeNPSelection(pr: T.PronounSelection): T.NPSelection {
                return {
                    type: "NP",
                    selection: pr,
                };
            }
            const verb = randFromArray(basicVerbs);
            const { subj, obj } = randomSubjObj();
            // const subj: T.NPSelection = {
            //     type: "NP",
            //     selection: randFromArray([
            //         makeRandPronoun,
            //         makeRandPronoun,
            //         makeRandomNoun,
            //         makeRandPronoun,
            //     ])(),
            // };
            // const tense = (l === "allIdentify" || l === "allProduce")
            //     ? randFromArray(tenses)
            //     : l;
            const tense = l;
            return makeVPS({
                verb,
                subject: makeNPSelection(makePronoun(subj)),
                object: makeNPSelection(makePronoun(obj)),
                tense,
            });
        }
        for (let i = 0; i < amount; i++) {
            const VPS = makeRandomVPS("presentVerb");
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
            <p className="lead">Write the present verb to complete the phrase</p>
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

function QuestionDisplay(question: Question) {
    const ps = flattenLengths(question.phrase.ps)[0];
    return <div>
        <div>{ps.p}</div>
        <div>{ps.f}</div>
        {question.phrase.e && <div>
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
        : tense === "wouldHaveBeen"
        ? `"would have been"`
        : tense;
}

function makeVPS({ verb, subject, object, tense }: {
    verb: T.VerbEntry,
    subject: T.NPSelection,
    object: T.NPSelection,
    tense: T.VerbTense,
}): T.VPSelectionComplete {
    const vps = makeVPSelectionState(verb);
    return {
        ...vps,
        verb: {
            ...vps.verb,
            tense,
        },
        blocks: [
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
                    selection: object,
                },
            },
        ],
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