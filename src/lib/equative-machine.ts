import {
    getPersonFromVerbForm,
    Types as T,
    getEnglishWord,
    grammarUnits,
    inflectWord,
    personIsPlural,
    removeFVarients,
    isUnisexSet,
    personGender,
    getVerbBlockPosFromPerson,
    addEnglish,
} from "@lingdocs/pashto-inflector";

export type EquativeMachineOutput = {
    subject: T.PsString[],
    predicate: T.PsString[],
    equative: T.SingleOrLengthOpts<T.ArrayOneOrMore<T.PsString>>,
};

export type EquativeNounInput = {
    entry: T.DictionaryEntry,
    plural: boolean,
};

export function equativeMachine(sub: T.Person | EquativeNounInput | T.DictionaryEntry, pred: T.DictionaryEntry): EquativeMachineOutput {
    const subjPerson = getSubPerson(sub);
    const isParticiple = !!(typeof sub !== "number" && "ts" in sub && sub.c?.startsWith("v."));
    if (!isParticiple && (typeof sub !== "number" && "ts" in sub)) {
        throw new Error("non participle subject should be in this form: { entry: T.Dictionary, plural: boolean }");
    }
    const subject = typeof sub === "number"
        ? makePronounSubject(sub) 
        : "entry" in sub
        ? makeNounSubject(sub)
        : makeParticipleSub(sub);
    const predicate = makePredicate(pred, subjPerson);
    const equative = makeEquative(subjPerson, isParticiple);

    return {
        subject,
        predicate,
        equative,
    };
}

function makePronounSubject(sub: T.Person): T.PsString[] {
    const [row, col] = getVerbBlockPosFromPerson(sub);
    return addEnglish(
        grammarUnits.persons[sub].label.subject,
        grammarUnits.pronouns.far.plain[row][col],
    );
}

function makeNounSubject(sub: EquativeNounInput): T.PsString[] {
    function makeEnglish(): string {
        const e = getEnglishWord(sub.entry);
        if (!e) {
            throw new Error(`unable to get english from subject ${sub.entry.f} - ${sub.entry.ts}`);
        }
        if (typeof e === "string") return `(A/The) ${e}`;
        if (sub.plural) {
            return `(The) ${e.plural}`;
        }
        if (!e.singular) {
            throw new Error(`unable to get english from subject ${sub.entry.f} - ${sub.entry.ts}`);
        }
        return `(A/The) ${e.singular}`;
    }
    function getPashto(): T.ArrayOneOrMore<T.PsString> {
        const infs = inflectWord(sub.entry);
        const gender = sub.entry.c?.includes("n. f.") ? "fem" : "masc";
        try {
            if (!infs || !sub.plural) {
                return [psStringFromEntry(sub.entry, english)];
            }
            if (!("plural" in infs)) {
                // @ts-ignore
                return infs.inflections[gender][sub.plural ? 1 : 0];
            }
            // @ts-ignore
            return infs.plural[gender][0]
        } catch (e) {
            throw new Error(`error making noun subject for ${sub.entry.f} ${sub.entry.ts}`);
        }
    }
    const english = makeEnglish();
    return addEnglish(
        english,
        getPashto(),
    );
}

function makeParticipleSub(sub: T.DictionaryEntry): T.PsString[] {
    return [
        psStringFromEntry(sub, getEnglishParticiple(sub)),
    ];
}

function makeEquative(pers: T.Person, isParticiple: boolean): T.SentenceForm {
    const [row, col] = getVerbBlockPosFromPerson(pers);
    return addEnglish(
        isParticiple
            ? grammarUnits.englishEquative.present[4][0]
            : grammarUnits.englishEquative.present[row][col],
        getPersonFromVerbForm(grammarUnits.equativeEndings.present, pers),
    );
}

function getSubPerson(sub: T.Person | EquativeNounInput | T.DictionaryEntry): T.Person {
    if (typeof sub === "number") {
        return sub;
    }
    if ("entry" in sub) {
        const gender = sub.entry.c?.includes("n. f.") ? "fem" : "masc";
        if (gender === "masc" && !sub.plural) {
            return T.Person.ThirdSingMale;
        }
        if (gender === "masc" && sub.plural) {
            return T.Person.ThirdPlurMale;
        }
        if (gender === "fem" && !sub.plural) {
            return T.Person.ThirdSingFemale;
        }
        //if (gender === "fem" && sub.plural) {
            return T.Person.ThirdPlurFemale;
        // }
    }
    if (!sub.c || !sub.c.startsWith("v.")) {
        throw new Error("subject should be a participle/verb");
    }
    return T.Person.ThirdPlurMale;
}

function makePredicate(pred: T.DictionaryEntry, pers: T.Person): T.PsString[] {
    const infs = inflectWord(pred);
    const e = retrieveEnglishPredicate(pred, pers);
    if (!e) {
        throw new Error(`unable to get english from predicate ${pred.f} - ${pred.ts}`);
    }
    const plural = personIsPlural(pers);
    const gender = personGender(pers);
    const makePlainPred = () => ([psStringFromEntry(pred, e)]);
    if (!infs || !infs.inflections || !isUnisexSet(infs.inflections)) {
        return makePlainPred();
    }
    if (plural && "plural" in infs && infs.plural) {
        const ps = gender in infs.plural
            // @ts-ignore
            ? infs.plural[gender][0] as T.PsString[]
            : makePlainPred();
        return ps.map((p) => ({ ...p, e }));
    }
    // if (infs.inflections) {
    const inflection = chooseInflection(infs.inflections, pers);
    return inflection.map((i) => ({ ...i, e }));
    // }
}

function chooseInflection(inflections: T.UnisexSet<T.InflectionSet>, pers: T.Person): T.PsString[] {
    return inflections[personGender(pers)][personIsPlural(pers) ? 1 : 0];
}

function retrieveEnglishPredicate(pred: T.DictionaryEntry, pers: T.Person): string | undefined {
    const english = getEnglishWord(pred);
    const plurSing = personIsPlural(pers) ? "plural" : "singular";
    return typeof english === "string"
        ? english
        : english === undefined
        ? undefined
        : english[plurSing]
        ? english[plurSing]
        : undefined;
}

function psStringFromEntry(entry: T.DictionaryEntry, e: string): T.PsString {
    return {
        p: entry.p,
        f: removeFVarients(entry.f),
        e,
    };
}

function getEnglishParticiple(entry: T.DictionaryEntry): string {
    return "doing";
}