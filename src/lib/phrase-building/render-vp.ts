import {
    Types as T,
    getVerbBlockPosFromPerson,
    grammarUnits,
    getEnglishWord,
    inflectWord,
    parseEc,
    conjugateVerb,
    concatPsString,
    removeAccents,
    getPersonNumber,
} from "@lingdocs/pashto-inflector";
import {
    psStringFromEntry,
    getLong,
} from "../text-tools";
import {
    getPersonFromNP, removeBa,
} from "./vp-tools";
import { isPattern4Entry } from "../type-predicates";
import { hasBaParticle } from "@lingdocs/pashto-inflector/dist/lib/p-text-helpers";

// TODO: ISSUE GETTING SPLIT HEAD NOT MATCHING WITH FUTURE VERBS

export function renderVP(VP: VPSelection): VPRendered {
    // Sentence Rules Logic
    const isPast = isPastTense(VP.verb.tense);
    const isTransitive = VP.object !== "none";
    const { king, servant } = getKingAndServant(isPast, isTransitive);
    const kingPerson = getPersonFromNP(VP[king]);
    // TODO: more elegant way of handling this type safety
    if (kingPerson === undefined) {
        throw new Error("king of sentance does not exist");
    }
    const subjectPerson = getPersonFromNP(VP.subject);
    const objectPerson = getPersonFromNP(VP.object);
    // TODO: also don't inflect if it's a pattern one animate noun
    const inflectSubject = isPast && isTransitive && !isMascSingAnimatePattern4(VP.subject);
    const inflectObject = !isPast && isFirstOrSecondPersPronoun(VP.object);
    // Render Elements
    return {
        type: "VPRendered",
        king,
        servant,
        isPast,
        isTransitive,
        subject: renderNPSelection(VP.subject, inflectSubject, false, "subject"),
        object: renderNPSelection(VP.object, inflectObject, true, "object"),
        verb: renderVerbSelection(VP.verb, kingPerson, objectPerson),
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
    if (NP.type === "noun") {
        return renderNounSelection(NP, inflected);
    }
    if (NP.type === "pronoun") {
        return renderPronounSelection(NP, inflected, inflectEnglish);
    }
    if (NP.type === "participle") {
        return renderParticipleSelection(NP, inflected)
    }
    throw new Error("unknown NP type");
};

function renderNounSelection(n: NounSelection, inflected: boolean): Rendered<NounSelection> {
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
    return {
        ...n,
        person: getPersonNumber(n.gender, n.number),
        inflected,
        ps: pashto,
        e: english,
    };
}

function renderPronounSelection(p: PronounSelection, inflected: boolean, englishInflected: boolean): Rendered<PronounSelection> {
    const [row, col] = getVerbBlockPosFromPerson(p.person);
    return {
        ...p,
        inflected,
        ps: grammarUnits.pronouns[p.distance][inflected ? "inflected" : "plain"][row][col],
        e: grammarUnits.persons[p.person].label[englishInflected ? "object" : "subject"],
    };
}

function renderParticipleSelection(p: ParticipleSelection, inflected: boolean): Rendered<ParticipleSelection> {
    return {
        ...p,
        inflected,
        person: T.Person.ThirdPlurMale,
        // TODO: More robust inflection of inflecting pariticiples - get from the conjugation engine 
        ps: [psStringFromEntry(p.verb.entry)].map(ps => inflected ? concatPsString(ps, { p: "و", f: "o" }) : ps),
        e: getEnglishParticiple(p.verb.entry),
    };
}

function renderVerbSelection(vs: VerbSelection, person: T.Person, objectPerson: T.Person | undefined): VerbRendered {
    const conjugations = conjugateVerb(vs.verb.entry, vs.verb.complement);
    // TODO: error handle this?
    // TODO: option to manually select these
    const conj = "grammaticallyTransitive" in conjugations
        ? conjugations.grammaticallyTransitive
        : "stative" in conjugations
        ? conjugations.stative
        : conjugations;
    // TODO: deliver the perfective split! 
    return {
        ...vs,
        person,
        ...getPsVerbConjugation(conj, vs.tense, person, objectPerson),
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
    const futureEngBuilder: T.EnglishBuilder = (s: T.Person, ec: T.EnglishVerbConjugationEc, n: boolean) => ([
        `$SUBJ will${n ? " not" : ""} ${isToBe(ec) ? "be" : ec[0]}`,
    ]);
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
    };
    const base = builders[tense](subjectPerson, ec, vs.negative);
    return base.map(b => `${b}${typeof object === "object" ? " $OBJ" : ""}${ep ? ` ${ep}` : ""}`);
}

function getPsVerbConjugation(conj: T.VerbConjugation, tense: VerbTense, person: T.Person, objectPerson: T.Person | undefined): {
    ps: {
        head: T.PsString | undefined,
        rest: T.SingleOrLengthOpts<T.PsString[]>,
    },
    hasBa: boolean,
} { 
    const f = getTenseVerbForm(conj, tense);
    const block = getMatrixBlock(f, objectPerson, person);
    const perfective = isPerfective(tense);
    const verbForm = getVerbFromBlock(block, person);
    const hasBa = hasBaParticle(getLong(verbForm)[0]);
    if (perfective) {
        const past = isPastTense(tense);
        const splitInfo = conj.info[past ? "root" : "stem"].perfectiveSplit;
        if (!splitInfo) return { ps: { head: undefined, rest: verbForm }, hasBa };
        // TODO: Either solve this in the inflector or here, it seems silly (or redundant)
        // to have a length option in the perfective split stem??
        const [splitHead] = getLong(getMatrixBlock(splitInfo, objectPerson, person));
        console.log("removing from verb form", { splitHead, verbForm });
        console.log(removeHead(splitHead, verbForm));
        return {
            hasBa,
            ps: {
                head: splitHead,
                rest: removeHead(splitHead, verbForm),
            },
        };
    }
    return { hasBa, ps: { head: undefined, rest: verbForm }};
}

function getVerbFromBlock(block: T.SingleOrLengthOpts<T.VerbBlock>, person: T.Person): T.SingleOrLengthOpts<T.PsString[]> {
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

function removeHead(head: T.PsString, rest: T.PsString[]): T.PsString[];
function removeHead(head: T.PsString, rest: T.SingleOrLengthOpts<T.PsString[]>): T.SingleOrLengthOpts<T.PsString[]>;
function removeHead(head: T.PsString, rest: T.SingleOrLengthOpts<T.PsString[]>): T.SingleOrLengthOpts<T.PsString[]> {
    if ("long" in rest) {
        return {
            long: removeHead(head, rest.long),
            short: removeHead(head, rest.short),
            ...rest.mini ? {
                mini: removeHead(head, rest.mini),
            } : {},
        }
    }
    return rest.map((psRaw) => {
        const ps = removeBa(psRaw);
        const pMatches = removeAccents(ps.p.slice(0, head.p.length)) === head.p
        const fMatches = removeAccents(ps.f.slice(0, head.f.length)) === removeAccents(head.f);
        if (!(pMatches && fMatches)) {
            throw new Error(`split head does not match - ${JSON.stringify(ps)} ${JSON.stringify(head)}`);
        }
        return {
            p: ps.p.slice(head.p.length), 
            f: ps.f.slice(head.f.length),
        }
    });
}

function getMatrixBlock<U>(f: {
    mascSing: T.SingleOrLengthOpts<U>;
    mascPlur: T.SingleOrLengthOpts<U>;
    femSing: T.SingleOrLengthOpts<U>;
    femPlur: T.SingleOrLengthOpts<U>;
} | T.SingleOrLengthOpts<U>, objectPerson: T.Person | undefined, kingPerson: T.Person): T.SingleOrLengthOpts<U> {
    if (!("mascSing" in f)) {
        return f;
    }
    function personToLabel(p: T.Person): "mascSing" | "mascPlur" | "femSing" | "femPlur" {
        if (p === T.Person.FirstSingMale || p === T.Person.SecondSingMale || p === T.Person.ThirdSingMale) {
            return "mascSing";
        }
        if (p === T.Person.FirstSingFemale || p === T.Person.SecondSingFemale || p === T.Person.ThirdSingFemale) {
            return "femSing";
        }
        if (p === T.Person.FirstPlurMale || p === T.Person.SecondPlurMale || p === T.Person.ThirdPlurMale) {
            return "mascPlur";
        }
        return "femPlur";
    }
    // if there's an object the matrix will agree with that, otherwise with the kingPerson (subject for intransitive)
    const person = (objectPerson === undefined) ? kingPerson : objectPerson;
    return f[personToLabel(person)];
}

function getTenseVerbForm(conj: T.VerbConjugation, tense: VerbTense): T.VerbForm {
    if (tense === "present") {
        return conj.imperfective.nonImperative;
    }
    if (tense === "subjunctive") {
        return conj.perfective.nonImperative;
    }
    if (tense === "imperfectiveFuture") {
        return conj.imperfective.future;
    }
    if (tense === "perfectiveFuture") {
        return conj.perfective.future;
    }
    if (tense === "imperfectivePast") {
        return conj.imperfective.past;
    }
    if (tense === "perfectivePast") {
        return conj.perfective.past;
    }
    throw new Error("unknown tense");
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

function isPerfective(t: VerbTense): boolean {
    if (t === "present" || t === "imperfectiveFuture" || t === "imperfectivePast") {
        return false;
    }
    if (t === "perfectiveFuture" || t === "subjunctive" || t === "perfectivePast") {
        return true;
    }
    throw new Error("tense not implemented yet");
}

function isMascSingAnimatePattern4(np: NPSelection): boolean {
    if (np.type !== "noun") {
        return false;
    }
    return isPattern4Entry(np.entry)
        && np.entry.c.includes("anim.")
        && (np.number === "singular")
        && (np.gender === "masc");
}
