import { Types as T } from "@lingdocs/pashto-inflector";

const englishPronouns = {
    subject: [
        "I (m.)",
        "I (f.)",
        "you (m.)",
        "you (f.)",
        "he/it (m.)",
        "she/it (m.)",
        "we (m.)",
        "we (f.)",
        "you (m. pl.)",
        "you (f. pl.)",
        "they (m. pl.)",
        "they (f. pl.)",
    ],
    object: [
        "me (m.)",
        "me (f.)",
        "you (m.)",
        "you (f.)",
        "him/it (m.)",
        "her/it (m.)",
        "us (m.)",
        "us (f.)",
        "you (m. pl.)",
        "you (f. pl.)",
        "them (m. pl.)",
        "them (f. pl.)",
    ],
};

export function getEnglishPronoun(person: T.Person, type: "subject" | "object"): string {
    return englishPronouns[type][person];
}