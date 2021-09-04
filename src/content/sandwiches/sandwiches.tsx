import React from "react";
import {
    Types as T,
} from "@lingdocs/pashto-inflector";

type SandwichInfo = {
    pre?: T.PsString,
    post?: T.PsString,
    e: string,
    examples: (T.PsJSX | T.PsString)[]
}

const sandwiches: SandwichInfo[] = [
    {
        pre: {p: "په", f: "pu"},
        post: {p: "کې", f: "ke"},
        e: "in / at",
        examples: [
            {
                p: <>زه <u><strong>په</strong> کور <strong>کې</strong></u> یم</>,
                f: <>zu <u><strong>pu</strong> kor <strong>ke</strong></u> yum</>,
                e: <>I'm <u><strong>at</strong> home</u></>,
            },
            {
                p: <>هغه <u><strong>په</strong> پارک <strong>کې</strong></u> دی</>,
                f: <>haghá <u><strong>pu</strong> paark <strong>ke</strong></u> dey</>,
                e: <>He's <u><strong>in</strong> the park</u></>,
            },
            {
                p: <>مونږ <u><strong>په</strong> افغانستان <strong>کې</strong></u> اوسېږو</>,
                f: <>moonG <u><strong>pu</strong> afghaanistaan <strong>ke</strong></u> oseGoo</>,
                e: <>We live <u><strong>in</strong> Afghanistan</u></>,
            },
        ],
    },
    {
        post: { p: "ته", f: "ta" },
        e: "to / towards",
        examples: [
            {
                p: <>زه <u><strong>ښار</strong> ته</u> ځم</>,    
                f: <>zu <u><strong>xaar</strong> ta</u> dzum</>,
                e: <>I'm going <u><strong>to</strong> the city</u></>,
            },
            {
                p: <><u><strong>ما</strong> ته</u> وګوره</>,
                f: <><u><strong>maa</strong> ta</u> óogora</>,
                e: <>Look <u>at <strong>me</strong></u></>,
            },
        ],
    },
    {
        pre: { p: "د", f: "du" },
        e: "of / 's",
        examples: [
            {
                p: <><u><strong>د</strong> یوسف</u> کور هلته دی</>,
                f: <><u><strong>du</strong> yoosuf</u> kor halta dey</>,
                e: <><u>Yousuf<strong>'s</strong></u> house is there</>,
            },
            {
                p: <>مونږ <u><strong>د</strong> پېشور</u> یو</>,
                f: <>moonG <u><strong>du</strong> pexawar</u> yoo</>,
                e: <>We are <u><strong>of</strong> Peshawer</u> (ie. We are from Peshawer)</>,
            },
            {
                p: <>د خبره <u><strong>د</strong> منلو</u> نه ده</>,
                f: <>daa khoraak <u><strong>du</strong> khoRulo</u> nu dey</>,
                e: <>That food is not <u>of eating</u> (ie. It's unfit for eating)</>,
            },
        ],
    },
    {
        pre: { p: "له", f: "la" },
        post: { p: "سره", f: "sara" },
        e: "with",
        examples: [
            {
                p: <>هغه <u><strong>له</strong> احمد <strong>سره</strong></u> دی</>,
                f: <>haghá <u><strong>la</strong> ahmad <strong>sara</strong></u> dey</>,
                e: <>He is <u><strong>with</strong> Ahmed</u>.</>,
            },
            {
                p: <>ته <u><strong>له</strong> ما <strong>سره</strong></u> ځې؟</>,
                f: <>tu <u><strong>la</strong> maa <strong>sara</strong></u> dze?</>,
                e: <>Will you go <u><strong>with</strong> me</u>?</>,
            },
        ],
    },
    {
        pre: { p: "د", f: "du" },
        post: { p: "دپاره", f: "dupaara" },
        e: "for",
        examples: [
            {
                p: <>دا <u><strong>د</strong> هغې <strong>دپاره</strong></u> دی</>,
                f: <>daa <u><strong>du</strong> haghé <strong>dupaara</strong></u> dey</>,
                e: <>This is <u><strong>for</strong> her</u></>,
            },
        ],
    },
    {
        pre: { p: "پر", f: "pur" },
        post: { p: "باندې", f: "baande" },
        e: "on",
        examples: [
            {
                p: <>کتاب <u><strong>پر</strong> مېز <strong>باندې</strong></u> دی</>,
                f: <>kitáab <u><strong>pur</strong> mez <strong>baande</strong></u> dey</>,
                e: <>The book is <u><strong>on</strong> the table</u></>,
            },
        ],
    },
    {
        pre: { p: "د", f: "du" },
        post: { p: "په اړه", f: "pu aRa" },
        e: "about / concerning",
        examples: [
            {
                p: <><u><strong>د</strong> تعلیم <strong>په اړه</strong></u> خبرې کوو</>,
                f: <><u><strong>du</strong> taleem <strong>pu aRa</strong></u> khabure kawoo</>,
                e: <>We are talking <u><strong>about</strong> education</u></>,
            },
        ],
    },
    {
        pre: { p: "د", f: "du" },
        post: { p: "په بارې کې", f: "pu baare ke" },
        e: "about / concerning",
        examples: [
            {
                p: <><u><strong>د</strong> تعلیم <strong>په بارې کې</strong></u> خبرې کوو</>,
                f: <><u><strong>du</strong> taleem <strong>pu baare ke</strong></u> khabure kawoo</>,
                e: <>We are talking <u><strong>about</strong> education</u></>,
            },
        ],
    },
    {
        pre: { p: "پر", f: "pur" },
        post: { p: "سربېره", f: "sărbera" },
        e: "in addition to, along with",
        examples: [
            {
                p: <><u><strong>پر</strong> وچکالۍ <strong>سربېره</strong></u> دلته جنګ هم شته</>,
                f: <><u><strong>pur</strong> wuchkaaluy <strong>sărbera</strong></u> dălta jang hum shta</>,
                e: <><u><strong>In addition to</strong> drought</u>, there is also war here</>,
            },
        ],
    },
];

export default sandwiches;

/*         

    {
        pre: {p: "په", f: "pu"},
        post: {p: "سره", f: "sara"},
        e: "with (in the adverbial sense)",
        examples: [
            {
                p: {
                    before: {p:"هغه", f:"hagha"},
                    mid: {p:"احطیات", f:"ihtiyaat"},
                    after: {p:"کار کوي", f:"kaar kawee"},
                },
                e: {
                    before: "He works ",
                    pre: "with ",
                    mid: "caution ",
                    post: "",
                    after: "(ie. carefully)",
                },
            },
        ]
    },
    {
        pre: {p: "له", f: "la"},
        post: {p: "نه", f: "na"},
        e: "from / than",
        examples: [
            {
                p: {
                    before: {p:"اروسه", f:"aroosa"},
                    mid: {p:"بازار", f:"baazaar"},
                    after: {p:"راځي", f:"raadzee"},
                },
                e: {
                    before: "Aroosa is coming ",
                    pre: "from",
                    mid: " the bazaar",
                    post: "",
                    after: "",
                },
            },
        ]
    },
    {
        pre: {p: "له", f: "la"},
        post: {p: "پرته", f: "prata"},
        e: "without",
        examples: [
            {
                p: {
                    before: {p:"دا وړاندېز", f:"daa wRaandez"},
                    mid: {p:"شرط", f:"shart"},
                    after: {p:"کړی دی", f:"kuRey dey"},
                },
                e: {
                    before: "He's made that offer ",
                    pre: "without",
                    mid: " condition",
                    post: "",
                    after: "",
                },
            },
        ]
    },
    {
        pre: {p: "له", f: "la"},
        post: {p: "څخه", f: "tsukha"},
        e: "from / than",
        examples: [
            {
                p: {
                    before: {p:"اروسه", f:"aroosa"},
                    mid: {p:"بازار", f:"baazaar"},
                    after: {p:"راځي", f:"raadzee"},
                },
                e: {
                    before: "Aroosa is coming ",
                    pre: "from",
                    mid: " the bazaar",
                    post: "",
                    after: "",
                },
            },
        ]
    },
    {
        pre: {p: "له", f: "la"},
        post: {p: "راهیسې", f: "raaheese"},
        e: "since, for",
        examples: [
            {
                p: {
                    before: {p:"", f:""},
                    mid: {p:"درېو کالو", f:"dreyo kaalo"},
                    after: {p:"کار کوم", f:"kaar kawum"},
                },
                e: {
                    before: "I've been working ",
                    pre: "for ",
                    mid: "three years",
                    post: "",
                    after: "",
                },
            },
        ]
    },
    {
        pre: {p: "په", f: "pu"},
        post: {p: "باندې", f: "baande"},
        e: "on / on top of",
        examples: [
            {
                p: {
                    before: {p:"کتاب", f:"kitaab"},
                    mid: {p:"مېز", f:"mez"},
                    after: {p:"دی", f:"dey"},
                },
                e: {
                    before: "The book is ",
                    pre: "on",
                    mid: " the table",
                    post: "",
                    after: "",
                },
            },
        ]
    },
    {
        pre: {p: "د", f: "du"},
        post: {p: "لاندې", f: "laande"},
        e: "under",
        examples: [
            {
                p: {
                    before: {p:"کتاب", f:"kitaab"},
                    mid: {p:"مېز", f:"mez"},
                    after: {p:"دی", f:"dey"},
                },
                e: {
                    before: "The book is ",
                    pre: "under",
                    mid: " the table",
                    post: "",
                    after: "",
                },
            },
        ]
    },
    {
        pre: {p: "تر", f: "tur"},
        post: {p: "پورې", f: "pore"},
        e: "until/up to",
        examples: [
            {
                p: {
                    before: {p:"", f:""},
                    mid: {p:"اوسه", f:"oosa"},
                    after: {p:"کار کوم", f:"kaar kawum"},
                },
                e: {
                    before: "I've been working ",
                    pre: "up until",
                    mid: " now",
                    post: "",
                    after: "",
                },
            },
        ]
    },
    {
        pre: {p: "د", f: "du"},
        post: {p: "له مخې", f: "la mukhe"},
        e: "according to",
        examples: [
            {
                p: {
                    before: {p:"هغه", f:"hagha"},
                    mid: {p:"یو پلان", f:"yo plaan"},
                    after: {p:"کار کوي", f:"kaar kawee"},
                },
                e: {
                    before: "He works ",
                    pre: "according to",
                    mid: " a plan",
                    post: "",
                    after: "",
                },
            },
        ]
    },
    {
        pre: {p: "له", f: "la"},
        post: {p: "مخکې", f: "mukhke"},
        e: "before",
        examples: [
            {
                p: {
                    before: {p:"", f:""},
                    mid: {p:"جنګ", f:"jang"},
                    after: {p:"خلک خوساله وو", f:"khalk khoshaala woo"},
                },
                e: {
                    before: "",
                    pre: "Before",
                    mid: " the war",
                    post: "",
                    after: " people were happy",
                },
            },
        ]
    },
    {
        pre: {p: "له", f: "la"},
        post: {p: "وروسته", f: "wroosta"},
        e: "after",
        examples: [
            {
                p: {
                    before: {p:"", f:""},
                    mid: {p:"جنګ", f:"jang"},
                    after: {p:"کاروبار خراب شو", f:"kaarobaar kharaab sho"},
                },
                e: {
                    before: "",
                    pre: "After",
                    mid: " the war",
                    post: "",
                    after: " business became bad",
                },
            },
        ]
    },
    {
        pre: {p: "د", f: "du"},
        post: {p: "نه بعد", f: "na ba'd"},
        e: "after",
        examples: [
            {
                p: {
                    before: {p:"", f:""},
                    mid: {p:"ډېر وخت", f:"Der wakht"},
                    after: {p:"خپل کلي ته راغلم", f:"khpul kulee ta raaghlum"},
                },
                e: {
                    before: "",
                    pre: "After",
                    mid: " a long time",
                    post: "",
                    after: " I've come to my own village",
                },
            },
        ]
    },
    {
        pre: {p:"بې له", f:"be la"},
        post: {p:"ه", f:"a"},
        e: "without",
        examples: [
            {
                p: {
                    before: {p:"داسې کلمې", f:"daase kalime"},
                    mid: {p:"کوم تغیر", f:"kUm tagheer"},
                    after: {p:"پښتو ته راننوتې دي", f:"puxto ta raanunawute dee"},
                },
                e: {
                    before: "Words like this came into Pashto",
                    pre: "without",
                    mid: "any change",
                    post: "",
                },
            },
        ],
    },
];

export default sandwiches; */