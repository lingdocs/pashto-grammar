/**
 * Copyright (c) 2021 lingdocs.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable import/no-webpack-loader-syntax */
// @ts-ignore
import * as intro from "!babel-loader!mdx-loader!./intro.mdx";

// @ts-ignore
import * as presentEquative from "!babel-loader!mdx-loader!./equatives/present-equative.mdx"
// @ts-ignore
import * as subjunctiveHabitualEquative from "!babel-loader!mdx-loader!./equatives/subjunctive-habitual-equative.mdx";
// @ts-ignore
import * as otherEquatives from "!babel-loader!mdx-loader!./equatives/other-equatives.mdx";

// @ts-ignore
import * as nounsGender from "!babel-loader!mdx-loader!./nouns/nouns-gender.mdx";
// @ts-ignore
import * as nounsUnisex from "!babel-loader!mdx-loader!./nouns/nouns-unisex.mdx";
// @ts-ignore
import * as nounsPlural from "!babel-loader!mdx-loader!./nouns/nouns-plural.mdx";
// @ts-ignore
import * as arabicPlurals from "!babel-loader!mdx-loader!./nouns/arabic-plurals.mdx";
// @ts-ignore
import * as bundledPlurals from "!babel-loader!mdx-loader!./nouns/bundled-plurals.mdx";

// @ts-ignore
import * as verbAspect from "!babel-loader!mdx-loader!./verbs/verb-aspect.mdx";
// @ts-ignore
import * as verbsIntro from "!babel-loader!mdx-loader!./verbs/verbs-intro.mdx";
// @ts-ignore
import * as presentVerbs from "!babel-loader!mdx-loader!./verbs/present-verbs.mdx";
// @ts-ignore
import * as subjunctiveVerbs from "!babel-loader!mdx-loader!./verbs/subjunctive-verbs.mdx";
// @ts-ignore
import * as futureVerbs from "!babel-loader!mdx-loader!./verbs/future-verbs.mdx";
// @ts-ignore
import * as imperativeVerbs from "!babel-loader!mdx-loader!./verbs/imperative-verbs.mdx";
// @ts-ignore
import * as verbEndings from "!babel-loader!mdx-loader!./verbs/verb-endings.mdx";
// @ts-ignore
import * as rootsAndStems from "!babel-loader!mdx-loader!./verbs/roots-and-stems.mdx";
// @ts-ignore
import * as sentenceStructure from "!babel-loader!mdx-loader!./verbs/sentence-structure.mdx";

// @ts-ignore
import * as pronounsBasic from "!babel-loader!mdx-loader!./pronouns/pronouns-basic.mdx";
// @ts-ignore
import * as pronounsMini from "!babel-loader!mdx-loader!./pronouns/pronouns-mini.mdx";
// @ts-ignore
import * as directionalPronouns from "!babel-loader!mdx-loader!./pronouns/pronouns-directional.mdx"; 

// @ts-ignore
import * as inflectionIntro from "!babel-loader!mdx-loader!./inflection/inflection-intro.mdx";
// @ts-ignore
import * as inflectionPatterns from "!babel-loader!mdx-loader!./inflection/inflection-patterns.mdx";
// @ts-ignore
import * as feminineInflection from "!babel-loader!mdx-loader!./inflection/feminine-inflection.mdx";

// @ts-ignore
import * as sandwiches from "!babel-loader!mdx-loader!./sandwiches/sandwiches.mdx";

// @ts-ignore
import * as theFiveYeys from "!babel-loader!mdx-loader!./writing/the-five-yeys.mdx";
// @ts-ignore
import * as typingIssues from "!babel-loader!mdx-loader!./writing/typing-issues.mdx";

const contentTree = [
    {
        import: intro,
        slug: "intro",
    },
    {
        heading: "Equatives",
        subdirectory: "equatives",
        chapters: [
            {
                import: presentEquative,
                slug: "present-equative",
            },
            {
                import: subjunctiveHabitualEquative,
                slug: "subjunctive-habitual-equative",
            },
            {
                import: otherEquatives,
                slug: "other-equatives",
            },
        ],
    },
    {
        heading: "Nouns",
        subdirectory: "nouns",
        chapters: [
            {
                import: nounsGender,
                slug: "nouns-gender",
            },
            {
                import: nounsUnisex,
                slug: "nouns-unisex",
            },
            {
                import: nounsPlural,
                slug: "nouns-plural",
            },
            {
                import: arabicPlurals,
                slug: "arabic-plurals",
            },
            {
                import: bundledPlurals,
                sluge: "bundled-plurals",
            },
        ],
    },
    {
        heading: "Verbs",
        subdirectory: "verbs",
        chapters: [
            {
                import: verbsIntro,
                slug: "verbs-intro",
            },
            {
                import: verbAspect,
                slug: "verb-aspect",
            },
            {
                import: rootsAndStems,
                slug: "roots-and-stems",
            },
            {
                import: presentVerbs,
                slug: "present-verbs",
            },
            {
                import: subjunctiveVerbs,
                slug: "subjunctive-verbs",
            },
            {
                import: futureVerbs,
                slug: "future-verbs",
            },
            {
                import: imperativeVerbs,
                slug: "imperative-verbs",
            },
            {
                import: verbEndings,
                slug: "verb-endings",
            },
            {
                import: sentenceStructure,
                slug: "sentence-structure",
            },
        ],
    },
    {
        heading: "Pronouns",
        subdirectory: "pronouns",
        chapters: [
            {
                import: pronounsBasic,
                slug: "pronouns-basic",
            },
            {
                import: pronounsMini,
                slug: "pronouns-mini",
            },
            {
                import: directionalPronouns,
                slug: "pronouns-directional",
            },
        ],
    },
    {
        heading: "Inflection 🔘",
        subdirectory: "inflection",
        chapters: [
            {
                import: inflectionIntro,
                slug: "inflection-intro",
            },
            {
                import: inflectionPatterns,
                slug: "inflection-patterns",
            },
            {
                import: feminineInflection,
                slug: "feminine-inflection",
            },
        ],
    },
    {
        heading: "Sandwiches 🥪",
        subdirectory: "sandwiches",
        chapters: [
            {
                import: sandwiches,
                slug: "sandwiches",
            },
        ],
    },
    {
        heading: "Writing 🖊",
        subdirectory: "writing",
        chapters: [
            {
                import: theFiveYeys,
                slug: "the-five-yeys",
            },
            {
                import: typingIssues,
                slug: "typing-issues",
            },
        ],
    },
];

export const content = contentTree.map((item) => {
    function prepareChapter(chp: any, subdir?: any) {
        return {
            path: subdir ? `/${subdir}/${chp.slug}/` : `/${chp.slug}/`,
            slug: chp.slug,
            content: chp.import.default,
            frontMatter: chp.import.frontMatter,
            tableOfContents: chp.import.tableOfContents(),
        };
    }
    return (item.import)
        ? prepareChapter(item)
        : {
            ...item,
            chapters: item.chapters?.map((c) => {
                return prepareChapter(c, item.subdirectory);
            }),
        };
}).map((item, i, items) => {
    // make the next and previous page information for each chapter
    function withNextPrev(current: any, index: any, arr: any) {
        function getInfo(x: any) {
            return x.content
                ? { frontMatter: x.frontMatter, path: x.path }
                : { frontMatter: x.chapters[0].frontMatter, path: x.chapters[0].path }; // TODO: KILL THIS?
        }
        function getNextOutsideItem() {
            // @ts-ignore
            return items[i+1].content
                // if it's a single chapter section, get that chapter
                ? items[i+1]
                // if it's a section with multiple chapters, get the first chapter
                // @ts-ignore
                : items[i+1].chapters[0];
        }
        function getPrevOutsideItem() {
            // @ts-ignore
            return items[i-1].content
                // if it's a single chapter section, get that chapter
                ? items[i-1]
                // if it's a section with multiple chapters, get the last chapter
                // @ts-ignore
                : items[i-1].chapters[items[i-1].chapters.length - 1];
        }
        const next = index < arr.length - 1
            // if there's another chapter in this section, that's the next one
            ? arr[index+1]
            // no? maybe there's another chapter or section in front of us
            : (i < items.length - 1)
            ? getNextOutsideItem()
            : false;
        const prev = index !== 0
            // if there's another chapter in this section, that's the previous one
            ? arr[index-1]
            // no? maybe we there's a chapter or section behind us
            : (i !== 0)
            ? getPrevOutsideItem()
            : false;
        return {
            ...current,
            ...prev ? {
                prev: getInfo(prev),
            } : {},
            ...next ? {
                next: getInfo(next),
            } : {},
        };
    }
    // @ts-ignore
    if (item.content) {
        return withNextPrev(item, i, items);
    }
    return {
        ...item,
        // @ts-ignore
        chapters: item.chapters.map((chapter, j, chapters) => (
            withNextPrev(chapter, j, chapters)
        )),
    }
});


// // Now that the paths are made, go through and make the next and previous page information for each chapter
// // STEP #2
// content.sections.forEach((section, i) => {
//     section.chapters.forEach((chapter, j) => {
//         // See if there's a next chapter
//         let nextChapter = j === section.chapters.length - 1 ? null : section.chapters[j + 1];
//         if (!nextChapter) {
//             // No? maybe there's something a section ahead (if that exists) 
//             nextChapter = i === content.sections.length - 1 ? null : content.sections[i + 1].chapters[0];
//         }
//         if (nextChapter) {
//             chapter.next = { frontMatter: nextChapter, path: nextChapter.path };
//         }
//         // See if there's a previous chapter
//         let prevChapter = j === 0 ? null : section.chapters[j - 1];
//         if (!prevChapter) {
//             // No? maybe there's something a section behind (if that exists) 
//             prevChapter = i === 0 ? null : content.sections[i - 1].chapters[content.sections[i - 1].chapters.length - 1];
//         }
//         if (prevChapter) {
//             chapter.previous = { frontMatter: prevChapter, path: prevChapter.path };
//         }
//     });
// });