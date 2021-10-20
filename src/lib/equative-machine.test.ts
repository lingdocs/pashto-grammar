import {
    equativeMachine,
    EquativeMachineOutput,
    SubjectInput,
    PredicateInput,
    ParticipleInput,
    assembleEquativeOutput,
} from "./equative-machine";
import {
    Types as T,
} from "@lingdocs/pashto-inflector";

// INPUTS
// Person (pronoun) - subject only
// Noun - subject/predicate
// Unisex Noun - subject/predicate
// Adjective - predicate only
// Participle - subject/predicate

// COMBINATIONS
// Subject    | Predicate     
// ---------------------------
// Person                  | Noun
// Person                  | Unisex Noun            ✔
// Person                  | Adjective              ✔
// Person                  | Participle             ✔
// Noun                    | Noun                   ✔
// Noun                    | Adjective              ✔
// Plural Noun             | Adjective              ✔  
// Noun                    | Participle             ✔
// Noun                    | Specified Unisex Noun  ✔
// Specified Unisex Noun   | Noun                   ✔
// Specified Unisex Noun   | Adjective              ✔
// Specified Unisex Noun   | Participle             ✔
// Participle              | Noun                   ✔
// Participle              | Adjective              ✔
// Participle              | Participle             ✔
// Participle              | Specified Unisex noun  ✔

// TODO: allow unisex subject inputs male or female!

const abilities: {
    label: string,
    tests: {
        in: {
            subject: SubjectInput,
            predicate: PredicateInput,
        },
        out: EquativeMachineOutput,
    }[],
}[] = [
    {
        label: "SUBJECT: Person PREDICATE: Adjective",
        tests: [
            // -- inflecting adjectives
            {
                in: {
                    subject: T.Person.FirstSingMale,
                    predicate: {"ts":1527815306,"i":7530,"p":"ستړی","f":"stúRey","g":"stuRey","e":"tired","c":"adj."} as Adjective,
                },
                out: {
                    subject: [{ p: "زه", f: "zu", e: "I (m.)" }],
                    predicate: [{ p: "ستړی", f: "stúRey", e: "tired" }],
                    equative: [{ p: "یم", f: "yum", e: "am" }],
                },
            },
            {
                in: {
                    subject: T.Person.SecondPlurFemale,
                    predicate: {"ts":1527815306,"i":7530,"p":"ستړی","f":"stúRey","g":"stuRey","e":"tired","c":"adj."} as Adjective,
                },
                out: {
                    subject: [{ p: "تاسو", f: "táaso", e: "You (f. pl.)" }, { p: "تاسې", f: "táase", e: "You (f. pl.)"}],
                    predicate: [{ p: "ستړې", f: "stúRe", e: "tired" }],
                    equative: [{ p: "یئ", f: "yeyy", e: "are" }],
                },
            },
            // -- non-inflecting adjectives
            {
                in: {
                    subject: T.Person.ThirdSingFemale,
                    predicate: {"ts":1527812798,"i":5595,"p":"خفه","f":"khufa","g":"khufa","e":"sad, upset, angry; choked, suffocated","c":"adj."} as Adjective,
                },
                out: {
                    subject: [{ p: "هغه", f: "haghá", e: "She/it (f.)" }],
                    predicate: [{ p: "خفه", f: "khufa", e: "sad" }],
                    equative: [{ p: "ده", f: "da", e: "is" }],
                },
            },
        ],
    },
    {
        label: "SUBJECT: Person PREDICATE: Unisex Noun",
        tests: [
            {
                in: {
                    subject: T.Person.FirstSingFemale,
                    predicate: {"ts":1591872915426,"i":696,"p":"افغانی","f":"afghaanéy","g":"afghaaney","e":"Afghan (person)","c":"n. m. anim. unisex"} as UnisexNoun,
                },
                out: {
                    subject: [{ p: "زه", f: "zu", e: "I (f.)" }],
                    predicate: [{ p: "افغانۍ", f: "afghaanúy", e: "(a/the) Afghan" }],
                    equative: [{ p: "یم", f: "yum", e: "am" }],
                }
            },
            {
                in: {
                    subject: T.Person.FirstPlurFemale,
                    predicate: {"ts":1591872915426,"i":696,"p":"افغانی","f":"afghaanéy","g":"afghaaney","e":"Afghan (person)","c":"n. m. anim. unisex"} as UnisexNoun,
                },
                out: {
                    subject: [{ p: "مونږ", f: "moonG", e: "We (f. pl.)" }, { p: "موږ", f: "mooG", e: "We (f. pl.)" }],
                    predicate: [
                        { p: "افغانیانې", f: "afghaaniyáane", e: "(the) Afghans" },
                        { p: "افغانۍ", f: "afghaanúy", e: "(the) Afghans" },
                    ],
                    equative: [{ p: "یو", f: "yoo", e: "are" }],
                },
            },
            {
                in: {
                    subject: T.Person.FirstPlurFemale,
                    predicate: {"ts":1527814779,"i":935,"p":"انسان","f":"insaan","g":"insaan","e":"human, person","c":"n. m. anim. unisex"} as UnisexNoun,
                },
                out: {
                    subject: [{ p: "مونږ", f: "moonG", e: "We (f. pl.)" }, { p: "موږ", f: "mooG", e: "We (f. pl.)" }],
                    predicate: [{ p: "انسانانې", f: "insaanáane", e: "(the) humans" }, { p: "انسانې", f: "insaane", e: "(the) humans" }],
                    equative: [{ p: "یو", f: "yoo", e: "are" }],
                },
            },
            {
                in: {
                    subject: T.Person.SecondSingFemale,
                    predicate: {"ts":1527814779,"i":935,"p":"انسان","f":"insaan","g":"insaan","e":"human, person","c":"n. m. anim. unisex"} as UnisexNoun,
                },
                out: {
                    subject: [{ p: "ته", f: "tu", e: "You (f.)" }],
                    predicate: [{ p: "انسانه", f: "insaana", e: "(a/the) human" }],
                    equative: [{ p: "یې", f: "ye", e: "are" }],
                },
            },
        ],
    },
    {
        label: "SUBJECT: Noun PREDICATE: Adjective",
        tests: [
            {
                in: {
                    subject: {
                        entry: { "ts":1527812817,"i":9921,"p":"کتاب","f":"kitáab","g":"kitaab","e":"book","c":"n. m." } as SingularEntry<Noun>,
                        plural: false,
                    },
                    predicate: {"ts":1527815451,"i":7193,"p":"زوړ","f":"zoR","g":"zoR","e":"old","c":"adj. irreg.","infap":"زاړه","infaf":"zaaRu","infbp":"زړ","infbf":"zaR"} as Adjective,
                },
                out: {
                    subject: [{ p: "کتاب", f: "kitáab", e: "(A/The) book" }],
                    predicate: [{ p: "زوړ", f: "zoR", e: "old" }],
                    equative: [{ p: "دی", f: "dey", e: "is" }],
                },
            },
            {
                in: {
                    subject: {
                        entry: { "ts":1527812817,"i":9921,"p":"کتاب","f":"kitáab","g":"kitaab","e":"book","c":"n. m." } as SingularEntry<Noun>,
                        plural: true,
                    },
                    predicate: {"ts":1527815451,"i":7193,"p":"زوړ","f":"zoR","g":"zoR","e":"old","c":"adj. irreg.","infap":"زاړه","infaf":"zaaRu","infbp":"زړ","infbf":"zaR"} as Adjective,
                },
                out: {
                    subject: [{ p: "کتابونه", f: "kitaabóona", e: "(The) books" }],
                    predicate: [{ p: "زاړه", f: "zaaRu", e: "old" }],
                    equative: [{ p: "دي", f: "dee", e: "are" }],
                },
            },
            {
                in: {
                    subject: {
                        entry: {"ts":1527812797,"i":8542,"p":"ښځه","f":"xúdza","g":"xudza","e":"woman, wife","c":"n. f. anim.","ec":"woman","ep":"women"} as SingularEntry<Noun>,
                        plural: false,
                    },
                    predicate: {"ts":1527815451,"i":7193,"p":"زوړ","f":"zoR","g":"zoR","e":"old","c":"adj. irreg.","infap":"زاړه","infaf":"zaaRu","infbp":"زړ","infbf":"zaR"} as Adjective,
                },
                out: {
                    subject: [{ p: "ښځه", f: "xúdza", e: "(A/The) woman" }],
                    predicate: [{ p: "زړه", f: "zaRa", e: "old" }],
                    equative: [{ p: "ده", f: "da", e: "is" }],
                },
            },
            {
                in: {
                    subject: {
                        entry: {"ts":1527812797,"i":8542,"p":"ښځه","f":"xúdza","g":"xudza","e":"woman, wife","c":"n. f. anim.","ec":"woman","ep":"women"} as SingularEntry<Noun>,
                        plural: true,
                    },
                    predicate: {"ts":1527815451,"i":7193,"p":"زوړ","f":"zoR","g":"zoR","e":"old","c":"adj. irreg.","infap":"زاړه","infaf":"zaaRu","infbp":"زړ","infbf":"zaR"} as Adjective,
                },
                out: {
                    subject: [{ p: "ښځې", f: "xúdze", e: "(The) women" }],
                    predicate: [{ p: "زړې", f: "zaRe", e: "old" }],
                    equative: [{ p: "دي", f: "dee", e: "are" }],
                },
            },
            // non-inflecting adjective as predicate
            {
                in: {
                    subject: {
                        entry: {"ts":1527812797,"i":8542,"p":"ښځه","f":"xúdza","g":"xudza","e":"woman, wife","c":"n. f. anim.","ec":"woman","ep":"women"} as SingularEntry<Noun>,
                        plural: true,
                    },
                    predicate: {"ts":1527812798,"i":5595,"p":"خفه","f":"khufa","g":"khufa","e":"sad, upset, angry; choked, suffocated","c":"adj."} as Adjective,
                },
                out: {
                    subject: [{ p: "ښځې", f: "xúdze", e: "(The) women" }],
                    predicate: [{ p: "خفه", f: "khufa", e: "sad" }],
                    equative: [{ p: "دي", f: "dee", e: "are" }],
                },
            },
        ],
    },
    {
        label: "SUBJECT: Plural Noun Predicate: Adjective",
        tests: [
            {
                in: {
                    subject: {
                        entry: {"ts":1527815008,"i":8433,"p":"شودې","f":"shoodé","g":"shoode","e":"milk","c":"n. f. pl."} as PluralEntry<Noun>,
                        plural: true,
                    },
                    predicate: {"ts":1527812796,"i":8578,"p":"ښه","f":"xu","g":"xu","e":"good","c":"adj."} as Adjective,
                },
                out: {
                    subject: [{ p: "شودې", f: "shoodé", e: "(The) milk" }],
                    predicate: [{ p: "ښې", f: "xe", e: "good" }],
                    equative: [{ p: "دي", f: "dee", e: "is" }],
                },
            },
            {
                in: {
                    subject: {
                        entry: {"ts":1527817330,"i":9204,"p":"غنم","f":"ghanúm","g":"ghanum","e":"wheat","c":"n. m. pl."} as PluralEntry<Noun>,
                        plural: true,
                    },
                    predicate: {"ts":1527815451,"i":7192,"p":"زوړ","f":"zoR","g":"zoR","e":"old","c":"adj. irreg.","infap":"زاړه","infaf":"zaaRu","infbp":"زړ","infbf":"zaR"} as Adjective,
                },
                out: {
                    subject: [{ p: "غنم", f: "ghanúm", e: "(The) wheat" }],
                    predicate: [{ p: "زاړه", f: "zaaRu", e: "old" }],
                    equative: [{ p: "دي", f: "dee", e: "is" }],
                },
            },
        ],
    },
    {
        label: "SUBJECT: Participle PREDICATE: Adjective",
        tests: [
            {
                in: {
                    subject: {"ts":1527812790,"i":5747,"p":"خوړل","f":"khoRul","g":"khoRul","e":"to eat, to bite","c":"v. trans.","psp":"خور","psf":"khor","tppp":"خوړ","tppf":"khoR","ec":"eat"} as ParticipleInput,
                    predicate: {"ts":1527812796,"i":8578,"p":"ښه","f":"xu","g":"xu","e":"good","c":"adj."} as Adjective,
                },
                out: {
                    subject: [{ p: "خوړل", f: "khoRul", e: "eating" }],
                    predicate: [{ p: "ښه", f: "xu", e: "good" }],
                    equative: [{ p: "دي", f: "dee", e: "is" }],
                },
            },
            {
                in: {
                    subject: {"ts":1527817298,"i":310,"p":"اخیستل","f":"akheestul","g":"akheestul","e":"to take, buy, purchase, receive; to shave, cut with scissors","c":"v. trans.","psp":"اخل","psf":"akhl","ec":"take,takes,taking,took,taken"} as ParticipleInput,
                    predicate: {"ts":1527815451,"i":7193,"p":"زوړ","f":"zoR","g":"zoR","e":"old","c":"adj. irreg.","infap":"زاړه","infaf":"zaaRu","infbp":"زړ","infbf":"zaR"} as Adjective,
                },
                out: {
                    subject: [{ p: "اخیستل", f: "akheestul", e: "taking" }],
                    predicate: [{ p: "زاړه", f: "zaaRu", e: "old" }],
                    equative: [{ p: "دي", f: "dee", e: "is" }],
                },
            },
            {
                in: {
                    subject: {"ts":1527816854,"i":4365,"p":"جګېدل","f":"jugedul, jigedul","g":"jugedul,jigedul","e":"to get up, be raised up","c":"v. stat. comp. intrans.","l":1527812707,"ec":"get, gets, getting, got, gotten","ep":"up"} as ParticipleInput,
                    predicate: {"ts":1527815246,"i":7591,"p":"سخت","f":"sakht","g":"sakht","e":"hard, difficult","c":"adj."} as Adjective,
                },
                out: {
                    subject: [{ p: "جګېدل", f: "jugedul", e: "getting up" }],
                    predicate: [{ p: "سخت", f: "sakht", e: "hard" }],
                    equative: [{ p: "دي", f: "dee", e: "is" }],
                },
            },
        ],
    },
    {
        label: "SUBJECT: Person PREDICATE: Participle",
        tests: [
            {
                in: {
                    subject: T.Person.SecondSingMale,
                    predicate: {"ts":1527812856,"i":11521,"p":"لیکل","f":"leekul","g":"leekul","e":"to write","c":"v. trans.","ec":"write,writes,writing,wrote,wrote"} as ParticipleInput,
                },
                out: {
                    subject: [{ p: "ته", f: "tu", e: "You (m.)" }],
                    predicate: [{ p: "لیکل", f: "leekul", e: "writing" }],
                    equative: [{ p: "دي", f: "dee", e: "are" }],  
                }
            },
        ],
    },
    {
        label: "SUBJECT: Noun PREDICATE: Noun",
        tests: [
            {
                in: {
                    subject: {
                        entry: {"ts":1527813477,"i":5790,"p":"خوشحالي","f":"khosh`haalee","g":"khoshhaalee","e":"happiness, joy","c":"n. f."} as SingularEntry<Noun>,
                        plural: false,
                    },
                    predicate: {
                        entry: {"ts":1527812788,"i":5729,"p":"خوراک","f":"khoráak, khwaráak","g":"khoraak,khwaraak","e":"food","c":"n. m."} as SingularEntry<Noun>,
                        plural: false,
                    },
                },
                out: {
                    subject: [{ p: "خوشحالي", f: "khosh`haalee", e: "(A/The) happiness" }],
                    predicate: [{ p: "خوراک", f: "khoráak", e: "(a/the) food" }],
                    equative: [{ p: "دی", f: "dey", e: "is" }],
                },
            },
        ],
    },
    {
        label: "SUBJECT: Noun PREDICATE: Participle",
        tests: [
            {
                in: {
                    subject: {
                        entry: {"ts":1527822878,"i":14157,"p":"وروروالی","f":"wrorwaaley","g":"wrorwaaley","e":"brotherhood, comradery, tight and good friendship","c":"n. m."} as SingularEntry<Noun>,
                        plural: false,
                    },
                    predicate: {"ts":1527816064,"i":7097,"p":"زغمل","f":"zghamul","g":"zghamul","e":"to endure, bear, tolerate, take on, digest","c":"v. trans.","tppp":"زغامه","tppf":"zghaamu","ec":"endure"} as ParticipleInput,
                },
                out: {
                    subject: [{ p: "وروروالی", f: "wrorwaaley", e: "(A/The) brotherhood" }],
                    predicate: [{ p: "زغمل", f: "zghamul", e: "enduring" }],
                    equative: [{ p: "دي", f: "dee", e: "is" }],
                },
            },
        ],
    },
    {
        label: "SUBJECT: Participle PREDICATE: Noun",
        tests: [
            {
                in: {
                    subject: {"ts":1527812856,"i":11521,"p":"لیکل","f":"leekul","g":"leekul","e":"to write","c":"v. trans.","ec":"write,writes,writing,wrote,wrote"} as ParticipleInput,
                    predicate: {
                        entry: {"ts":1527813477,"i":5790,"p":"خوشحالي","f":"khosh`haalee","g":"khoshhaalee","e":"happiness, joy","c":"n. f."} as SingularEntry<Noun>,
                        plural: false,
                    },
                },
                out: {
                    subject: [{ p: "لیکل", f: "leekul", e: "writing" }],
                    predicate: [{ p: "خوشحالي", f: "khosh`haalee", e: "(a/the) happiness" }],
                    equative: [{ p: "ده", f: "da", e: "is" }],
                },
            },
        ],
    },
    {
        label: "SUBJECT: Participle PREDICATE: Participle",
        tests: [
            {
                in: {
                    subject: {"ts":1527812856,"i":11521,"p":"لیکل","f":"leekul","g":"leekul","e":"to write","c":"v. trans.","ec":"write,writes,writing,wrote,wrote"} as ParticipleInput,
                    predicate: {"ts":1577394057681,"i":2784,"p":"پوهېدل","f":"pohedul","g":"pohedul","e":"to understand (to come to a state of understanding)","c":"v. stat. comp. intrans.","l":1527811469,"ec":"understand,understand,understanding,understood"} as ParticipleInput,
                },
                out: {
                    subject: [{ p: "لیکل", f: "leekul", e: "writing" }],
                    predicate: [{ p: "پوهېدل", f: "pohedul", e: "understanding" }],
                    equative: [{ p: "دي", f: "dee", e: "is" }],
                },
            },
        ],
    },
    {
        label: "SUBJECT: Noun PREDICATE: Specified Unisex Noun",
        tests: [
            {
                in: {
                    subject: {
                        entry: {"ts":1527812817,"i":9921,"p":"کتاب","f":"kitáab","g":"kitaab","e":"book","c":"n. m."} as SingularEntry<Noun>,
                        plural: true,
                    },
                    predicate: {
                        entry: {"ts":1527815127,"i":13259,"p":"نرس","f":"nars, nursa","g":"nars,nursa","e":"nurse","c":"n. m. anim. unisex"} as SingularEntry<Noun>,
                        plural: false,
                        gender: "fem",
                    },
                },
                out: {
                    subject: [{ p: "کتابونه", f: "kitaabóona", e: "(The) books" }],
                    predicate: [{ p: "نرسه", f: "narsa", e: "(a/the) nurse" }],
                    equative: [{ p: "ده", f: "da", e: "are" }],
                },
            },
        ],
    },
    {
        label: "SUBJECT: Specified Unisex Noun PREDICATE: Adjective",
        tests: [
            {
                in: {
                    subject: {
                        entry: {"ts":1527815127,"i":13259,"p":"نرس","f":"nars, nursa","g":"nars,nursa","e":"nurse","c":"n. m. anim. unisex"} as SingularEntry<Noun>,
                        plural: true,
                        gender: "fem",
                    },
                    predicate: {"ts":1527815451,"i":7193,"p":"زوړ","f":"zoR","g":"zoR","e":"old","c":"adj. irreg.","infap":"زاړه","infaf":"zaaRu","infbp":"زړ","infbf":"zaR"} as Adjective,
                },
                out: {
                    subject: [
                        { p: "نرسانې", f: "narsáane", e: "(The) nurses" },
                        { p: "نرسې", f: "narse", e: "(The) nurses" },
                    ],
                    predicate: [{ p: "زړې", f: "zaRe", e: "old" }],
                    equative: [{ p: "دي", f: "dee", e: "are" }],
                },
            },
        ],
    },
    {
        label: "SUBJECT: Specified Unisex Noun PREDICATE: Predicate",
        tests: [
            {
                in: {
                    subject: {
                        entry: {"ts":1527815127,"i":13259,"p":"نرس","f":"nars, nursa","g":"nars,nursa","e":"nurse","c":"n. m. anim. unisex"} as SingularEntry<Noun>,
                        plural: false,
                        gender: "fem",
                    },
                    predicate: {
                        entry: {"ts":1527812817,"i":9921,"p":"کتاب","f":"kitáab","g":"kitaab","e":"book","c":"n. m."} as SingularEntry<Noun>,
                        plural: true,
                    },
                },
                out: {
                    subject: [{ p: "نرسه", f: "narsa", e: "(A/The) nurse" }],
                    predicate: [{ p: "کتابونه", f: "kitaabóona", e: "(the) books" }],
                    equative: [{ p: "دي", f: "dee", e: "is" }],
                },
            },
        ],
    },
    {
        label: "SUBJECT: Specified Unisex Noun PREDICATE: Participle",
        tests: [
            {
                in: {
                    subject: {
                        entry: {"ts":1527815127,"i":13259,"p":"نرس","f":"nars, nursa","g":"nars,nursa","e":"nurse","c":"n. m. anim. unisex"} as SingularEntry<Noun>,
                        plural: false,
                        gender: "fem",
                    },
                    predicate: {"ts":1527813680,"i":9131,"p":"غږېدل","f":"ghuGedul, ghaGedul","g":"ghugedul,ghagedul","e":"to converse, speak, talk, sing","c":"v. intrans.","ec":"speak,speaks,speaking,spoke"} as ParticipleInput,
                },
                out: {
                    subject: [{ p: "نرسه", f: "narsa", e: "(A/The) nurse" }],
                    predicate: [{ p: "غږېدل", f: "ghuGedul", e: "speaking" }],
                    equative: [{ p: "دي", f: "dee", e: "is" }],
                },
            },
        ],
    },
    {
        label: "SUBJECT: Participle PREDICATE: Specified Unisex Noun",
        tests: [
            {
                in: {
                    subject: {"ts":1527812856,"i":11521,"p":"لیکل","f":"leekul","g":"leekul","e":"to write","c":"v. trans.","ec":"write,writes,writing,wrote,wrote"} as ParticipleInput,
                    predicate: {
                        entry: {"ts":1527815127,"i":13259,"p":"نرس","f":"nars, nursa","g":"nars,nursa","e":"nurse","c":"n. m. anim. unisex"} as SingularEntry<Noun>,
                        plural: false,
                        gender: "fem",
                    },
                },
                out: {
                    subject: [{ p: "لیکل", f: "leekul", e: "writing" }],
                    predicate: [{ p: "نرسه", f: "narsa", e: "(a/the) nurse" }],
                    equative: [{ p: "ده", f: "da", e: "is" }],
                },
            },
        ],
    },
];

describe("equativeMachine", () => {
    abilities.forEach((a) => {
        test(a.label, () => {
            a.tests.forEach((t) => {
                expect(equativeMachine(t.in.subject, t.in.predicate)).toEqual(t.out);
            });
        });
    });
});

test("assembleEquativeOutput", () => {
    expect(assembleEquativeOutput({
        subject: [{ p: "کتابونه", f: "kitaabóona", e: "(The) books" }],
        predicate: [{ p: "زاړه", f: "zaaRu", e: "old" }],
        equative: [{ p: "دي", f: "dee", e: "are" }],
    })).toEqual([{ p: "کتابونه زاړه دي", f: "kitaabóona zaaRu dee", e: "(The) books are old" }]);
    expect(assembleEquativeOutput({
        subject: [{ p: "مونږ", f: "moonG", e: "We (f. pl.)" }, { p: "موږ", f: "mooG", e: "We (f. pl.)" }],
        predicate: [
            { p: "افغانیانې", f: "afghaaniyáane", e: "(the) Afghans" },
            { p: "افغانۍ", f: "afghaanúy", e: "(the) Afghans" },
        ],
        equative: [{ p: "یو", f: "yoo", e: "are" }],
    })).toEqual([
        { p: "مونږ افغانیانې یو", f: "moonG afghaaniyáane yoo", e: "We (f. pl.) are (the) Afghans" },
        { p: "مونږ افغانۍ یو", f: "moonG afghaanúy yoo", e: "We (f. pl.) are (the) Afghans" },
        { p: "موږ افغانیانې یو", f: "mooG afghaaniyáane yoo", e: "We (f. pl.) are (the) Afghans" },
        { p: "موږ افغانۍ یو", f: "mooG afghaanúy yoo", e: "We (f. pl.) are (the) Afghans" },
    ]);
});