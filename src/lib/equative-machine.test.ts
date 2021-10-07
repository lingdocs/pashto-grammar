import {
    equativeMachine,
    EquativeMachineOutput,
    EquativeNounInput,
} from "./equative-machine";
import {
    Types as T,
} from "@lingdocs/pashto-inflector";

const abilities: {
    label: string,
    tests: {
        in: {
            subject: T.Person | EquativeNounInput | T.DictionaryEntry,
            predicate: T.DictionaryEntry,
        },
        out: EquativeMachineOutput,
    }[],
}[] = [
    {
        label: "handle person subjects with adjective predicates",
        tests: [
            // -- inflecting adjectives
            {
                in: {
                    subject: T.Person.FirstSingMale,
                    predicate: {"ts":1527815306,"i":7530,"p":"ستړی","f":"stúRey","g":"stuRey","e":"tired","c":"adj."},
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
                    predicate: {"ts":1527815306,"i":7530,"p":"ستړی","f":"stúRey","g":"stuRey","e":"tired","c":"adj."},
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
                    predicate: {"ts":1527812798,"i":5595,"p":"خفه","f":"khufa","g":"khufa","e":"sad, upset, angry; choked, suffocated","c":"adj."},
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
        label: "handle person subjects with unisex noun predicate",
        tests: [
            {
                in: {
                    subject: T.Person.FirstSingFemale,
                    predicate: {"ts":1591872915426,"i":696,"p":"افغانی","f":"afghaanéy","g":"afghaaney","e":"Afghan (person)","c":"n. m. unisex"},
                },
                out: {
                    subject: [{ p: "زه", f: "zu", e: "I (f.)" }],
                    predicate: [{ p: "افغانۍ", f: "afghaanúy", e: "Afghan" }],
                    equative: [{ p: "یم", f: "yum", e: "am" }],
                }
            },
            {
                in: {
                    subject: T.Person.FirstPlurFemale,
                    predicate: {"ts":1527814779,"i":935,"p":"انسان","f":"insaan","g":"insaan","e":"human, person","c":"n. m. anim. unisex"},
                },
                out: {
                    subject: [{ p: "مونږ", f: "moonG", e: "We (f. pl.)" }, { p: "موږ", f: "mooG", e: "We (f. pl.)" }],
                    predicate: [{ p: "انسانانې", f: "insaanáane", e: "humans" }],
                    equative: [{ p: "یو", f: "yoo", e: "are" }],
                },
            },
            {
                in: {
                    subject: T.Person.SecondSingFemale,
                    predicate: {"ts":1527814779,"i":935,"p":"انسان","f":"insaan","g":"insaan","e":"human, person","c":"n. m. anim. unisex"},
                },
                out: {
                    subject: [{ p: "ته", f: "tu", e: "You (f.)" }],
                    predicate: [{ p: "انسانه", f: "insaana", e: "human" }],
                    equative: [{ p: "یې", f: "ye", e: "are" }],
                },
            },
        ],
    },
    {
        label: "Handle noun subjects with adjective predicates",
        tests: [
            {
                in: {
                    subject: {
                        entry: { "ts":1527812817,"i":9921,"p":"کتاب","f":"kitáab","g":"kitaab","e":"book","c":"n. m." },
                        plural: false,
                    },
                    predicate: {"ts":1527815451,"i":7193,"p":"زوړ","f":"zoR","g":"zoR","e":"old","c":"adj. irreg.","infap":"زاړه","infaf":"zaaRu","infbp":"زړ","infbf":"zaR"},
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
                        entry: { "ts":1527812817,"i":9921,"p":"کتاب","f":"kitáab","g":"kitaab","e":"book","c":"n. m." },
                        plural: true,
                    },
                    predicate: {"ts":1527815451,"i":7193,"p":"زوړ","f":"zoR","g":"zoR","e":"old","c":"adj. irreg.","infap":"زاړه","infaf":"zaaRu","infbp":"زړ","infbf":"zaR"},
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
                        entry: {"ts":1527812797,"i":8542,"p":"ښځه","f":"xúdza","g":"xudza","e":"woman, wife","c":"n. f. anim.","ec":"woman","ep":"women"},
                        plural: false,
                    },
                    predicate: {"ts":1527815451,"i":7193,"p":"زوړ","f":"zoR","g":"zoR","e":"old","c":"adj. irreg.","infap":"زاړه","infaf":"zaaRu","infbp":"زړ","infbf":"zaR"},
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
                        entry: {"ts":1527812797,"i":8542,"p":"ښځه","f":"xúdza","g":"xudza","e":"woman, wife","c":"n. f. anim.","ec":"woman","ep":"women"},
                        plural: true,
                    },
                    predicate: {"ts":1527815451,"i":7193,"p":"زوړ","f":"zoR","g":"zoR","e":"old","c":"adj. irreg.","infap":"زاړه","infaf":"zaaRu","infbp":"زړ","infbf":"zaR"},
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
                        entry: {"ts":1527812797,"i":8542,"p":"ښځه","f":"xúdza","g":"xudza","e":"woman, wife","c":"n. f. anim.","ec":"woman","ep":"women"},
                        plural: true,
                    },
                    predicate: {"ts":1527812798,"i":5595,"p":"خفه","f":"khufa","g":"khufa","e":"sad, upset, angry; choked, suffocated","c":"adj."},
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
        label: "handle participle subjects with adjective predicates",
        tests: [
            {
                in: {
                    subject: {"ts":1527812790,"i":5747,"p":"خوړل","f":"khoRul","g":"khoRul","e":"to eat, to bite","c":"v. trans.","psp":"خور","psf":"khor","tppp":"خوړ","tppf":"khoR","ec":"eat"},
                    predicate: {"ts":1527812796,"i":8578,"p":"ښه","f":"xu","g":"xu","e":"good","c":"adj."},
                },
                out: {
                    subject: [{ p: "خوړل", f: "khoRul", e: "eating" }],
                    predicate: [{ p: "ښه", f: "xu", e: "good" }],
                    equative: [{ p: "دي", f: "dee", e: "is" }],
                },
            },
            {
                in: {
                    subject: {"ts":1527817298,"i":310,"p":"اخیستل","f":"akheestul","g":"akheestul","e":"to take, buy, purchase, receive; to shave, cut with scissors","c":"v. trans.","psp":"اخل","psf":"akhl","ec":"take,takes,taking,took,taken"},
                    predicate: {"ts":1527815451,"i":7193,"p":"زوړ","f":"zoR","g":"zoR","e":"old","c":"adj. irreg.","infap":"زاړه","infaf":"zaaRu","infbp":"زړ","infbf":"zaR"},
                },
                out: {
                    subject: [{ p: "اخیستل", f: "akheestul", e: "taking" }],
                    predicate: [{ p: "زاړه", f: "zaaRu", e: "old" }],
                    equative: [{ p: "دي", f: "dee", e: "is" }],
                },
            }
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