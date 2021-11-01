import {
    Types as T,
    grammarUnits,
    getVerbBlockPosFromPerson,
    getPersonFromVerbForm,
    concatPsString,
    removeAccents,
} from "@lingdocs/pashto-inflector";
import {
    personFromNP,
    evaluateNP,
} from "./np-tools";
import {
    evaluateCompliment,
} from "./compliment-tools";
import { isPluralNounEntry } from "./type-predicates";

// Equative Rules
// - An equative equates a SUBJECT: Noun Phrase and a PREDICATE: Noun Phrase | Compliment
// - In Pashto, the equative agrees with the predicate when the predicate is a Noun Phrase,
//   otherwise it agrees with the subject
// - If the subject is a pronoun, always agree with the subject
// - In English, the equative agrees with the subject

export function equativeMachine(e: EquativeClause): EquativeClauseOutput {
    const ba = (e.tense === "future" || e.tense === "wouldBe");
    const subject = evaluateNP(e.subject);
    const predicate = ("type" in e.predicate && e.predicate.type === "compliment")
        ? evaluateCompliment(e.predicate, personFromNP(e.subject))
        : evaluateNP(e.predicate);
    const equative = makeEquative(e);
    const negative = !!e?.negative;
    return {
        ba,
        subject,
        predicate,
        equative,
        negative,
    };
}

export function assembleEquativeOutput(o: EquativeClauseOutput): T.SingleOrLengthOpts<T.ArrayOneOrMore<T.PsString>> {
    if ("long" in o.equative.ps) {
        return {
            long: assembleEquativeOutput({ ...o, equative: { ...o.equative, ps: o.equative.ps.long }}) as T.ArrayOneOrMore<T.PsString>,
            short: assembleEquativeOutput({ ...o, equative: { ...o.equative, ps:o.equative.ps.short }}) as T.ArrayOneOrMore<T.PsString>,
        }
    }
    // get all possible combinations of subject, predicate, and equative
    // soooo cool how this works 🤓
    const equatives = o.equative.ps;
    const predicates = o.predicate.ps;
    const ba = o.ba ? { p: " به", f: " ba" } : "";
    const neg = o.negative ? { p: "نه ", f: "nú " } : "";
    const ps = o.subject.ps.flatMap(subj => (
        predicates.flatMap(pred => (
            equatives.map(eq => (
                concatPsString(
                    subj,
                    ba,
                    " ",
                    pred,
                    " ",
                    neg,
                    o.negative ? removeAccents(eq) : eq,
                ))
            )
        ))
    ));
    const e = `${o.subject.e} ${o.equative.e[0]} ${o.predicate.e}`;
    return ps.map(x => ({ ...x, e })) as T.ArrayOneOrMore<T.PsString>;
}

function makeEquative(e: EquativeClause) {
    function getEngEq(row: number, col: number): string[] {
        const t = grammarUnits.englishEquative[e.tense === "subjunctive" ? "present" : e.tense];
        return typeof t === "string"
            ? [t]
            : [t[row][col]];
    }
    const baseTense = (e.tense === "future")
        ? "subjunctive"
        : e.tense === "wouldBe"
        ? "past"
        : e.tense;
    const subjP = personFromNP(e.subject);
    const englishPerson = (e.subject.type === "participle" || (e.subject.type === "noun" && isPluralNounEntry(e.subject.entry)))
        ? T.Person.ThirdSingMale
        : subjP
    const pashtoPerson = (e.subject.type === "pronoun")
        ? e.subject.person
        : ("type" in e.predicate && e.predicate.type === "compliment")
        ? subjP
        : personFromNP(e.predicate);
    return {
        ps: getPersonFromVerbForm(
            grammarUnits.equativeEndings[baseTense],
            pashtoPerson,
        ),
        e: getEngEq(...getVerbBlockPosFromPerson(englishPerson)),
    };
}
