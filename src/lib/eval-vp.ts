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
} from "./text-tools";

export function renderVP(VP: VPSelection): VPRendered {
    // TODO: Will be based on past tense etc
    const isPast = isPastTense(VP.verb.tense);
    const isTransitive = VP.object !== "none";
    const { king, /* servant */ } = getKingAndServant(isPast, isTransitive);
    console.log({ king, isPast, isTransitive });
    const verbPerson = getPersonFromNP(VP[king]);
    const subjectPerson = getPersonFromNP(VP.subject);
    // TODO: also don't inflect if it's a pattern one animate noun
    const inflectSubject = isPast && isTransitive; 
    console.log({ inflectSubject });
    const subject: Rendered<NPSelection> = {
        ...VP.subject,
        inflected: inflectSubject,
        ...textOfNP(VP.subject, inflectSubject, false),
    };
    const inflectObject = !isPast && isFirstOrSecondPersPronoun(VP.object);
    const object: "none" | Rendered<NPSelection> | T.Person.ThirdPlurMale = typeof VP.object === "object"
        ? {
            ...VP.subject,
            inflected: inflectObject,
            ...textOfNP(VP.object, inflectObject, true),
        } : VP.object;
    // TODO: error handle this?
    const conjugations = conjugateVerb(VP.verb.verb.entry, VP.verb.verb.complement);
    // TODO: option to manually select these
    const conj = "grammaticallyTransitive" in conjugations
        ? conjugations.grammaticallyTransitive
        : "stative" in conjugations
        ? conjugations.stative
        : conjugations;
    return {
        type: "VPRendered",
        subject,
        object,
        verb: {
            ...VP.verb,
            person: verbPerson,
            ps: getPsVerbConjugation(conj, VP.verb.tense, verbPerson),
            e: getEnglishVerbConjugation({
                subjectPerson,
                object: VP.object,
                v: parseEc(VP.verb.verb.entry.ec || ""),
                ep: VP.verb.verb.entry.ep,
                tense: VP.verb.tense,
                n: false,
            }),
        },
    };
}

export function compileVP(VP: VPRendered | VPSelection): { ps: T.SingleOrLengthOpts<T.PsString[]>, e?: string [] } {
    if (VP.type === "VPSelection") {
        return compileVP(renderVP(VP));
    }
    function insertEWords(e: string, { subject, object }: { subject: string, object?: string }): string {
        return e.replace("$SUBJ", subject).replace("$OBJ", object || "");
    }
    // TODO: display of short and long options etc.
    const vPs = "long" in VP.verb.ps ? VP.verb.ps.long : VP.verb.ps;
    const engSubj = VP.subject.e || undefined;
    const engObj = (typeof VP.object === "object" && VP.object.e) ? VP.object.e : undefined;
    // require all English parts for making the English phrase
    const e = (VP.verb.e && engSubj && engObj) ? VP.verb.e.map(e => insertEWords(e, {
        subject: engSubj,
        object: engObj,
    })) : undefined;
    const obj = typeof VP.object === "object" ? VP.object : undefined;
    const ps = VP.subject.ps.flatMap(s => (
        obj ? obj.ps.flatMap(o => (
            vPs.flatMap(v => (
                concatPsString(s, " ", o, " ", v)
            ))
        )) : vPs.flatMap(v => (
            concatPsString(s, " ", v)
        ))
    ));
    return { ps, e };
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

function getEnglishVerbConjugation({ subjectPerson, object, ep, v, tense, n }: {
    subjectPerson: T.Person,
    object: "none" | NPSelection | T.Person.ThirdPlurMale,
    v: T.EnglishVerbConjugationEc,
    ep: string | undefined,
    tense: VerbTense,
    n: boolean,
}): string[] {
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
        present: (s: T.Person, v: T.EnglishVerbConjugationEc, n: boolean) => ([
            `$SUBJ ${isToBe(v)
                ? `${engEquative("present", s)}${n ? " not" : ""}`
                : `${n ? engPresC(s, ["don't", "doesn't"]) : ""} ${n ? v[0] : engPresC(s, v)}`}`,
            `$SUBJ ${engEquative("present", s)}${n ? " not" : ""} ${v[2]}`,
        ]),
        subjunctive: (s: T.Person, v: T.EnglishVerbConjugationEc, n: boolean) => ([
            `that $SUBJ ${n ? " won't" : " will"} ${isToBe(v) ? "be" : v[0]}`,
            `should $SUBJ ${n ? " not" : ""} ${isToBe(v) ? "be" : v[0]}`,
        ]),
        imperfectivePast: (s: T.Person, v: T.EnglishVerbConjugationEc, n: boolean) => ([
            //  - subj pastEquative (N && "not") v.2 obj
            `$SUBJ ${engEquative("past", s)}${n ? " not" : ""} ${v[2]}`,
            //  - subj "would" (N && "not") v.0 obj
            `$SUBJ would${n ? " not" : ""} ${isToBe(v) ? "be" : v[0]}`,
            //  - subj pastEquative (N && "not") going to" v.0 obj
            `$SUBJ ${engEquative("past", s)}${n ? " not" : ""} going to ${isToBe(v) ? "be" : v[0]}`,
        ]),
        perfectivePast: (s: T.Person, v: T.EnglishVerbConjugationEc, n: boolean) => ([
            `$SUBJ${isToBe(v)
                ? ` ${engEquative("past", s)}${n ? " not" : ""}`
                : `${n ? " did not" : ""} ${v[3]}`}`,
        ]),
    };
    const base = builders[tense](subjectPerson, v, n);
    return base.map(b => `${b}${typeof object === "object" ? " $OBJ" : ""}${ep ? ` ${ep}` : ""}`);
}

function getPersonFromNP(np: NPSelection | T.Person.ThirdPlurMale | "none"): T.Person {
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

function textOfPronoun(p: PronounSelection, inflected: boolean, englishInflected: boolean): { ps: T.PsString[], e: string } {
    // TODO: Will need to handle inflecting and inflecting english pronouns etc.
    const [row, col] = getVerbBlockPosFromPerson(p.person);
    return {
        ps: grammarUnits.pronouns[p.distance][inflected ? "inflected" : "plain"][row][col],
        e: grammarUnits.persons[p.person].label[englishInflected ? "object" : "subject"],
    };
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

export function getEnglishParticiple(entry: T.DictionaryEntry): string {
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
