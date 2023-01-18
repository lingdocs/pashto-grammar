import {
    Types as T,
    randFromArray,
} from "@lingdocs/ps-react";

export const sandwiches: T.Sandwich[] = [ 
    {
        type: "sandwich",
        before: { p: "له", f: "la" },
        after: { p: "نه", f: "na" },
        e: "from",
    },
    {
        type: "sandwich",
        before: { p: "له", f: "la" },
        after: { p: "څخه", f: "tsuxa" },
        e: "from",
    },
    {
        type: "sandwich",
        before: { p: "له", f: "la" },
        after: { p: "سره", f: "sara" },
        e: "with",
    },
    {
        type: "sandwich",
        before: undefined,
        after: { p: "ته", f: "ta" },
        e: "to",
    },
    {
        type: "sandwich",
        before: { p: "د", f: "du" },
        after: { p: "لپاره", f: "lapaara" },
        e: "for",
    },
    {
        type: "sandwich",
        before: { p: "د", f: "du" },
        after: { p: "په څانګ", f: "pu tsaang" },
        e: "beside",
    },
    // {
    //     type: "sandwich",
    //     before: { p: "په", f: "pu" },
    //     after: { p: "کې", f: "ke" },
    //     e: "in",
    // },
    {
        type: "sandwich",
        before: { p: "د", f: "du" },
        after: { p: "لاندې", f: "laande" },
        e: "under",
    },
    {
        type: "sandwich",
        before: { p: "د", f: "du" },
        after: { p: "په شان", f: "pu shaan" },
        e: "like",
    },
    {
        type: "sandwich",
        before: { p: "د", f: "du" },
        after: { p: "غوندې", f: "ghwunde" },
        e: "like",
    },
    // {
    //     type: "sandwich",
    //     before: { p: "د", f: "du" },
    //     after: { p: "په اړه", f: "pu aRa" },
    //     e: "about",
    // },
];

export function makeSandwich(np: T.NPSelection): T.APSelection {
    return {
        type: "AP",
        selection: {
            ...randFromArray(sandwiches),
            inside: np,
        },
    };
}
