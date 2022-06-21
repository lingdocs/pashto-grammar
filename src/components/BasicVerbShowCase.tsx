import {
    Types as T,
    RootsAndStems,
    conjugateVerb,
    VerbTable,
    renderVP,
    compileVP,
    ButtonSelect,
    getEnglishVerb,
    InlinePs,
    removeFVarients,
} from "@lingdocs/pashto-inflector";
import { isImperativeTense } from "@lingdocs/pashto-inflector/dist/lib/type-predicates";
import { useState } from "react";
import Carousel from "./Carousel";
import { basicVerbs } from "../content/verbs/basic-present-verbs";

function BasicVerbShowCase({ opts, tense }: {
    opts: T.TextOptions,
    tense: T.VerbTense | T.ImperativeTense, 
}) {
    return <Carousel stickyTitle items={basicVerbs} render={(item) => {
        return {
            title: <InlinePs opts={opts}>{{
                ...removeFVarients(item.entry),
                e: undefined,
            }}</InlinePs>,
            body: <BasicVerbChart
                verb={item}
                opts={opts}
                tense={tense}
            />,
        };
    }}/>
}

export default BasicVerbShowCase;

function BasicVerbChart({ verb, opts, tense }: {
    verb: T.VerbEntry,
    opts: T.TextOptions,
    tense: T.VerbTense | T.ImperativeTense,
}) {
    const [negative, setNegative] = useState<boolean>(false);
    const c = conjugateVerb(verb.entry, verb.complement);
    const conjugations = "stative" in c
        ? c.stative
        : "grammaticallyTransitive" in c
        ? c.grammaticallyTransitive
        : c;
    const phrasesForTable = makeExamplePhrases(verb, tense, negative)
    return <div>
        <div>
            {getEnglishVerb(verb.entry)}
        </div>
        <RootsAndStems
            textOptions={opts}
            info={conjugations.info}
            hidePastParticiple={true}
            highlighted={[tenseToStem(tense)]}
        />
        <div className="my-3">
            <ButtonSelect
                handleChange={(value) => setNegative(value === "true")}
                value={String(negative)}
                small
                options={[
                    { value: "true", label: "Neg." },
                    { value: "false", label: "Pos." },
                ]}
            />
        </div>
        <div className="text-left">
            <VerbTable
                textOptions={opts}
                block={phrasesForTable.ps}
                english={phrasesForTable.e}
            />
        </div>
    </div>
}

function makeExamplePhrases(verb: T.VerbEntry, tense: T.VerbTense | T.ImperativeTense, negative: boolean): { ps: T.VerbBlock | T.ImperativeBlock, e: T.EnglishBlock } {
    function makeSelection(person: T.Person): T.VPSelectionComplete{
        return {
            "blocks": [
                {"key":Math.random(),"block":{"type":"subjectSelection","selection":{"type":"NP","selection":{"type":"pronoun","person": person,"distance":"far"}}}},
                {
                    key: Math.random(),
                    // @ts-ignore
                    block: verb.entry.c?.includes("intrans.")
                        ? {"type":"objectSelection","selection":"none"}
                        : {"type":"objectSelection", "selection":{"type":"NP","selection":{"type":"noun","entry":{"ts":1527812817,"i":10011,"p":"کتاب","f":"kitáab","g":"kitaab","e":"book","c":"n. m."},"gender":"masc","genderCanChange":false,"number":"singular","numberCanChange":true,"adjectives":[]}}},
                },
            ],
            "verb":{
                "type":"verb",
                verb,
                tense,
                "transitivity":"intransitive",
                "isCompound":false,
                "voice":"active",
                negative,
                "canChangeTransitivity":false,
                "canChangeVoice":false,
                "canChangeStatDyn":false,
            },
            "form":{"removeKing":false,"shrinkServant":false},
        };
    }
    function makePhrase(person: T.Person): { ps: T.ArrayOneOrMore<T.PsString>, e: string } {
        const selection = makeSelection(person);
        const rendered = renderVP(selection);
        const compiled = compileVP(rendered, rendered.form, true);
        return {
            ps: [modifyP(compiled.ps[0])],
            e: compiled.e ? modifyEnglish(compiled.e.join(" • ")) : "",
        };
    }
    return createVerbTable(makePhrase, isImperativeTense(tense) ? "imperative" : "nonImperative");
}

function modifyP(ps: T.PsString): T.PsString {
    return {
        p: ps.p.replace(" کتاب ", ""),
        f: ps.f.replace(" kitáab ", ""),
    };
}

function modifyEnglish(e: string): string {
    // "kitaab" used as a dummy object
    return e
        .replace(/\(a\/the\) +book/ig, "")
        .replace(/he\/it/ig, "he/she/it")
        .replace(/We \(m\. pl\.\)/ig, "We ")
        .replace(/They \(m\. pl\.\)/ig, "They ")
        .replace(/\(m\. pl\.\)/ig, "(pl.)")
        .replace(/\(m\.\)/ig, "");
}

function tenseToStem(t: T.VerbTense | T.ImperativeTense): "imperfective stem" | "perfective stem" | "imperfective root" | "perfective root" {
    return t === "presentVerb"
        ? "imperfective stem"
        : t === "subjunctiveVerb"
        ? "perfective stem"
        : t === "imperfectiveFuture"
        ? "imperfective stem"
        : t === "perfectiveFuture"
        ? "perfective stem"
        : t === "imperfectivePast"
        ? "imperfective root"
        : t === "perfectivePast"
        ? "perfective root"
        : t === "habitualImperfectivePast"
        ? "imperfective root"
        : t === "habitualPerfectivePast"
        ? "perfective root"
        : t === "imperfectiveImperative"
        ? "imperfective root"
        : "perfective root";
}

function createVerbTable(f: (person: T.Person) => { ps: T.ArrayOneOrMore<T.PsString>, e: string }, type: "imperative" | "nonImperative"): { ps: T.VerbBlock | T.ImperativeBlock, e: T.EnglishBlock } {
    if (type === "imperative") {
        const b = [
            [f(2), f(8)],
            [f(3), f(9)],
        ];
        return {
            ps: [
                [b[0][0].ps, b[0][1].ps],
                [b[1][0].ps, b[1][1].ps],
            ],
            e: [
                [b[0][0].e, b[0][1].e],
                [b[1][0].e, b[1][1].e],
                [b[0][0].e, b[0][1].e],
                [b[1][0].e, b[1][1].e],
                [b[0][0].e, b[0][1].e],
                [b[1][0].e, b[1][1].e],
            ],
        };

    }
    const b = [
        [f(0), f(6)],
        [f(1), f(7)],
        [f(2), f(8)],
        [f(3), f(9)],
        [f(4), f(10)],
        [f(5), f(11)],
    ];
    return {
        ps: [
            [b[0][0].ps, b[0][1].ps],
            [b[1][0].ps, b[1][1].ps],
            [b[2][0].ps, b[2][1].ps],
            [b[3][0].ps, b[3][1].ps],
            [b[4][0].ps, b[4][1].ps],
            [b[5][0].ps, b[5][1].ps],
        ],
        e: [
            [b[0][0].e, b[0][1].e],
            [b[1][0].e, b[1][1].e],
            [b[2][0].e, b[2][1].e],
            [b[3][0].e, b[3][1].e],
            [b[4][0].e, b[4][1].e],
            [b[5][0].e, b[5][1].e],
        ],
    };
}