import {
    Types as T,
    getVerbBlockPosFromPerson,
    grammarUnits,
    parseEc,
} from "@lingdocs/pashto-inflector";

export function renderEnglishVPBase({ subjectPerson, object, vs }: {
    subjectPerson: T.Person,
    object: NPSelection | ObjectNP,
    vs: VerbSelection,
}): string[] {
    const ec = parseEc(vs.verb.entry.ec || "");
    const ep = vs.verb.entry.ep;
    const tense = vs.tense;
    function engEquative(tense: "past" | "present", s: T.Person): string {
        const [row, col] = getVerbBlockPosFromPerson(s);
        return grammarUnits.englishEquative[tense][row][col];
    }
    function engPresC(s: T.Person, ec: T.EnglishVerbConjugationEc | [string, string]): string {
        function isThirdPersonSing(p: T.Person): boolean {
            return (
                p === T.Person.ThirdSingMale ||
                p === T.Person.ThirdSingFemale
            );
        }
        return isThirdPersonSing(s) ? ec[1] : ec[0];
    }
    function isToBe(v: T.EnglishVerbConjugationEc): boolean {
        return (v[2] === "being");
    }
    const futureEngBuilder: T.EnglishBuilder = (s: T.Person, ec: T.EnglishVerbConjugationEc, n: boolean) => ([
        `$SUBJ will${n ? " not" : ""} ${isToBe(ec) ? "be" : ec[0]}`,
    ]);
    // TODO: Pull these out to a seperate entity and import it
    const builders: Record<
        VerbTense,
        (s: T.Person, v: T.EnglishVerbConjugationEc, n: boolean) => string[]
    > = {
        present: (s: T.Person, ec: T.EnglishVerbConjugationEc, n: boolean) => ([
            `$SUBJ ${isToBe(ec)
                ? `${engEquative("present", s)}${n ? " not" : ""}`
                : `${n ? engPresC(s, ["don't", "doesn't"]) : ""} ${n ? ec[0] : engPresC(s, ec)}`}`,
            `$SUBJ ${engEquative("present", s)}${n ? " not" : ""} ${ec[2]}`,
        ]),
        subjunctive: (s: T.Person, ec: T.EnglishVerbConjugationEc, n: boolean) => ([
            `that $SUBJ ${n ? " won't" : " will"} ${isToBe(ec) ? "be" : ec[0]}`,
            `should $SUBJ ${n ? " not" : ""} ${isToBe(ec) ? "be" : ec[0]}`,
        ]),
        imperfectiveFuture: futureEngBuilder,
        perfectiveFuture: futureEngBuilder,
        imperfectivePast: (s: T.Person, ec: T.EnglishVerbConjugationEc, n: boolean) => ([
            //  - subj pastEquative (N && "not") ec.2 obj
            `$SUBJ ${engEquative("past", s)}${n ? " not" : ""} ${ec[2]}`,
            //  - subj "would" (N && "not") ec.0 obj
            `$SUBJ would${n ? " not" : ""} ${isToBe(ec) ? "be" : ec[0]}`,
            //  - subj pastEquative (N && "not") going to" ec.0 obj
            `$SUBJ ${engEquative("past", s)}${n ? " not" : ""} going to ${isToBe(ec) ? "be" : ec[0]}`,
        ]),
        perfectivePast: (s: T.Person, ec: T.EnglishVerbConjugationEc, n: boolean) => ([
            `$SUBJ${isToBe(ec)
                ? ` ${engEquative("past", s)}${n ? " not" : ""}`
                : (n ? ` did not ${ec[0]}` : ` ${ec[3]}`)
            }`
        ]),
        habitualPerfectivePast: (s: T.Person, ec: T.EnglishVerbConjugationEc, n: boolean) => ([
            `$SUBJ would${n ? " not" : ""} ${isToBe(ec) ? "be" : ec[0]}`,
            `$SUBJ used to${n ? " not" : ""} ${isToBe(ec) ? "be" : ec[0]}`,
        ]),
        habitualImperfectivePast: (s: T.Person, ec: T.EnglishVerbConjugationEc, n: boolean) => ([
            `$SUBJ would${n ? " not" : ""} ${isToBe(ec) ? "be" : ec[0]}`,
            `$SUBJ used to${n ? " not" : ""} ${isToBe(ec) ? "be" : ec[0]}`,
        ]),
    };
    const modalBuilders: Record<
        VerbTense,
        (s: T.Person, v: T.EnglishVerbConjugationEc, n: boolean) => string[]
    > = {
        present: (s: T.Person, v: T.EnglishVerbConjugationEc, n: boolean) => ([
            `$SUBJ can${n ? "'t" : ""} ${isToBe(v) ? "be" : v[0]}`,
        ]),
        subjunctive: (s: T.Person, v: T.EnglishVerbConjugationEc, n: boolean) => ([
            `that $SUBJ can${n ? "'t" : ""} ${isToBe(v) ? "be" : v[0]}`,
        ]),
        imperfectiveFuture: (s: T.Person, v: T.EnglishVerbConjugationEc, n: boolean) => ([
            `$SUBJ will${n ? " not" : ""} be able to ${isToBe(v) ? "be" : v[0]}`,
        ]),
        perfectiveFuture: (s: T.Person, v: T.EnglishVerbConjugationEc, n: boolean) => ([
            `$SUBJ will${n ? " not" : ""} be able to ${isToBe(v) ? "be" : v[0]}`,
        ]),
        imperfectivePast: (s: T.Person, v: T.EnglishVerbConjugationEc, n: boolean) => ([
            `$SUBJ ${engEquative("past", s)} ${n ? " not" : ""} able to ${isToBe(v) ? "be" : v[0]}`,
            `$SUBJ could${n ? " not" : ""} ${v[0]}`,
        ]),
        perfectivePast: (s: T.Person, v: T.EnglishVerbConjugationEc, n: boolean) => ([
            `$SUBJ ${engEquative("past", s)} ${n ? " not" : ""} able to ${isToBe(v) ? "be" : v[0]}`,
            `$SUBJ could${n ? " not" : ""} ${isToBe(v) ? "be" : v[0]}`,
        ]),
        habitualImperfectivePast: (s: T.Person, v: T.EnglishVerbConjugationEc, n: boolean) => ([
            `$SUBJ used to ${n ? " not" : ""} be able to ${isToBe(v) ? "be" : v[0]}`,
            `$SUBJ would ${n ? " not" : ""} be able to ${isToBe(v) ? "be" : v[0]}`,
        ]),
        habitualPerfectivePast: (s: T.Person, v: T.EnglishVerbConjugationEc, n: boolean) => ([
            `$SUBJ used to ${n ? " not" : ""} be able to ${isToBe(v) ? "be" : v[0]}`,
            `$SUBJ would ${n ? " not" : ""} be able to ${isToBe(v) ? "be" : v[0]}`,
        ]),
    };
    const base = (vs.tenseCategory === "basic" ? builders : modalBuilders)[tense](subjectPerson, ec, vs.negative);
    return base.map(b => `${b}${typeof object === "object" ? " $OBJ" : ""}${ep ? ` ${ep}` : ""}`);
}