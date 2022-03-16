import {
    Types as T,
    getVerbBlockPosFromPerson,
    grammarUnits,
    getEnglishWord,
    inflectWord,
    parseEc,
    conjugateVerb,
    concatPsString,
} from "@lingdocs/pashto-inflector";
import {
    psStringFromEntry,
} from "../text-tools";

export function renderVP(VP: VPSelection): VPRendered {
    // Sentence Rules Logic
    const isPast = isPastTense(VP.verb.tense);
    const isTransitive = VP.object !== "none";
    const { king, /* servant */ } = getKingAndServant(isPast, isTransitive);
    const kingPerson = getPersonFromNP(VP[king]);
    const subjectPerson = getPersonFromNP(VP.subject);
    // const objectPerson = getPersonFromNP(VP.object);
    // TODO: also don't inflect if it's a pattern one animate noun
    const inflectSubject = isPast && isTransitive;
    const inflectObject = !isPast && isFirstOrSecondPersPronoun(VP.object);
    // Render Elements
    return {
        type: "VPRendered",
        subject: renderNPSelection(VP.subject, inflectSubject, false, "subject"),
        object: renderNPSelection(VP.object, inflectObject, true, "object"),
        verb: renderVerbSelection(VP.verb, kingPerson),
        englishBase: renderEnglishVPBase({
            subjectPerson,
            object: VP.object,
            vs: VP.verb,
        }),
    };
}

function renderNPSelection(NP: NPSelection, inflected: boolean, inflectEnglish: boolean, role: "subject"): Rendered<NPSelection>
function renderNPSelection(NP: NPSelection | ObjectNP, inflected: boolean, inflectEnglish: boolean, role: "object"): Rendered<NPSelection> | T.Person.ThirdPlurMale | "none";
function renderNPSelection(NP: NPSelection | ObjectNP, inflected: boolean, inflectEnglish: boolean, role: "subject" | "object"): Rendered<NPSelection> | T.Person.ThirdPlurMale | "none" {
    if (typeof NP !== "object") {
        if (role !== "object") {
            throw new Error("ObjectNP only allowed for objects");
        }
        return NP;
    }
    return {
        ...NP,
        inflected,
        ...textOfNP(NP, inflected, inflectEnglish),
    };
};

function renderVerbSelection(vs: VerbSelection, person: T.Person): VerbRendered {
    const conjugations = conjugateVerb(vs.verb.entry, vs.verb.complement);
    // TODO: error handle this?
    // TODO: option to manually select these
    const conj = "grammaticallyTransitive" in conjugations
        ? conjugations.grammaticallyTransitive
        : "stative" in conjugations
        ? conjugations.stative
        : conjugations;
    // TODO: get the object person from the matrix on stative compounds
    return {
        ...vs,
        person,
        ps: getPsVerbConjugation(conj, vs.tense, person),
    }
}

function renderEnglishVPBase({ subjectPerson, object, vs }: {
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
                : `${n ? " did not" : ""} ${ec[3]}`}`,
        ]),
    };
    const base = builders[tense](subjectPerson, ec, vs.negative);
    return base.map(b => `${b}${typeof object === "object" ? " $OBJ" : ""}${ep ? ` ${ep}` : ""}`);
}

function getPsVerbConjugation(conj: T.VerbConjugation, tense: VerbTense, person: T.Person): T.SingleOrLengthOpts<T.PsString[]> {
    const f = getTenseVerbForm(conj, tense);
    // TODO: ability to grab the correct part of matrix
    const block = "mascSing" in f
        ? f.mascSing
        : f;
    function grabFromBlock(b: T.VerbBlock, [row, col]: [ row: number, col: number ]): T.PsString[] {
        return b[row][col];
    }
    const pos = getVerbBlockPosFromPerson(person);
    if ("long" in block) {
        return {
            long: grabFromBlock(block.long, pos),
            short: grabFromBlock(block.short, pos),
            ...block.mini ? {
                mini: grabFromBlock(block.mini, pos),
            } : {},
        };
    }
    return grabFromBlock(block, pos);
}

function getTenseVerbForm(conj: T.VerbConjugation, tense: VerbTense): T.VerbForm {
    if (tense === "present") {
        return conj.imperfective.nonImperative;
    }
    if (tense === "subjunctive") {
        return conj.perfective.nonImperative;
    }
    if (tense === "imperfectivePast") {
        return conj.imperfective.past;
    }
    if (tense === "perfectivePast") {
        return conj.perfective.past;
    }
    throw new Error("unknown tense");
}

function getPersonFromNP(np: NPSelection | ObjectNP): T.Person {
    if (np === "none") {
        throw new Error("empty entity");
    }
    if (typeof np === "number") return np;
    if (np.type === "participle") {
        return T.Person.ThirdPlurMale;
    }
    if (np.type === "pronoun") {
        return np.person;
    }
    return np.number === "plural"
        ? (np.gender === "masc" ? T.Person.ThirdPlurMale : T.Person.ThirdPlurFemale)
        : (np.gender === "masc" ? T.Person.ThirdSingMale : T.Person.ThirdSingFemale);
}

function textOfNP(np: NPSelection, inflected: boolean, englishInflected: boolean): { ps: T.PsString[], e: string } {
    if (np.type === "participle") {
        return textOfParticiple(np, inflected);
    }
    if (np.type === "pronoun") {
        return textOfPronoun(np, inflected, englishInflected);
    }
    return textOfNoun(np, inflected);
}

function textOfParticiple({ verb: { entry }}: ParticipleSelection, inflected: boolean): { ps: T.PsString[], e: string } {
    // TODO: ability to inflect participles
    return {
        // TODO: More robust inflection of inflecting pariticiples - get from the conjugation engine 
        ps: [psStringFromEntry(entry)].map(ps => inflected ? concatPsString(ps, { p: "و", f: "o" }) : ps),
        e: getEnglishParticiple(entry),
    };
}

function getEnglishParticiple(entry: T.DictionaryEntry): string {
    if (!entry.ec) {
        console.log("errored participle");
        console.log(entry);
        throw new Error("no english information for participle");
    }
    const ec = parseEc(entry.ec);
    const participle = ec[2];
    return (entry.ep)
        ? `${participle} ${entry.ep}`
        : participle;
}

function textOfPronoun(p: PronounSelection, inflected: boolean, englishInflected: boolean): { ps: T.PsString[], e: string } {
    // TODO: Will need to handle inflecting and inflecting english pronouns etc.
    const [row, col] = getVerbBlockPosFromPerson(p.person);
    return {
        ps: grammarUnits.pronouns[p.distance][inflected ? "inflected" : "plain"][row][col],
        e: grammarUnits.persons[p.person].label[englishInflected ? "object" : "subject"],
    };
}

function textOfNoun(n: NounSelection, inflected: boolean): { ps: T.PsString[], e: string } {
    const english = getEnglishFromNoun(n.entry, n.number);
    const pashto = ((): T.PsString[] => {
        const infs = inflectWord(n.entry);
        const ps = n.number === "singular"
            ? getInf(infs, "inflections", n.gender, false, inflected)
            : [
                ...getInf(infs, "plural", n.gender, true, inflected),
                ...getInf(infs, "arabicPlural", n.gender, true, inflected),
                ...getInf(infs, "inflections", n.gender, true, inflected),
            ];
        return ps.length > 0
            ? ps
            : [psStringFromEntry(n.entry)];
    })();
    return { ps: pashto, e: english };
}

function getEnglishFromNoun(entry: T.DictionaryEntry, number: NounNumber): string {
    const articles = {
        singular: "(a/the)",
        plural: "(the)",
    };
    const article = articles[number];
    function addArticle(s: string) {
        return `${article} ${s}`;
    }
    const e = getEnglishWord(entry);
    if (!e) throw new Error(`unable to get english from subject ${entry.f} - ${entry.ts}`);

    if (typeof e === "string") return ` ${e}`;
    if (number === "plural") return addArticle(e.plural);
    if (!e.singular || e.singular === undefined) {
        throw new Error(`unable to get english from subject ${entry.f} - ${entry.ts}`);
    }
    return addArticle(e.singular);
}

function getInf(infs: T.InflectorOutput, t: "plural" | "arabicPlural" | "inflections", gender: T.Gender, plural: boolean, inflected: boolean): T.PsString[] {
    // @ts-ignore
    if (infs && t in infs && infs[t] !== undefined && gender in infs[t] && infs[t][gender] !== undefined) {
        // @ts-ignore
        const iset = infs[t][gender] as T.InflectionSet;
        const inflectionNumber = (inflected ? 1 : 0) + ((t === "inflections" && plural) ? 1 : 0);
        console.log({ t, plural, inflectionNumber });
        return iset[inflectionNumber];
    }
    return [];
}

function isPastTense(tense: VerbTense): boolean {
    return tense.toLowerCase().includes("past");
}

function getKingAndServant(isPast: boolean, isTransitive: boolean): 
    { king: "subject", servant: "object" } |
    { king: "object", servant: "subject" } |
    { king: "subject", servant: undefined } {
    if (!isTransitive) {
        return { king: "subject", servant: undefined };
    }
    return isPast ? {
        king: "object",
        servant: "subject",
    } : {
        king: "subject",
        servant: "object",
    };
}

function isFirstOrSecondPersPronoun(o: "none" | NPSelection | T.Person.ThirdPlurMale): boolean {
    if (typeof o !== "object") return false;
    if (o.type !== "pronoun") return false;
    return [0,1,2,3,6,7,8,9].includes(o.person);
}