/**
 * Copyright (c) 2021 lingdocs.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable import/no-webpack-loader-syntax */
// @ts-ignore
import * as intro from "!babel-loader!@lingdocs/mdx-loader!./intro.mdx";

// @ts-ignore
import * as presentEquative from "!babel-loader!@lingdocs/mdx-loader!./equatives/present-equative.mdx";
// @ts-ignore
import * as habitualEquative from "!babel-loader!@lingdocs/mdx-loader!./equatives/habitual-equative.mdx";
// @ts-ignore
import * as otherEquatives from "!babel-loader!@lingdocs/mdx-loader!./equatives/other-equatives.mdx";
// @ts-ignore
import * as equativeExplorer from "!babel-loader!@lingdocs/mdx-loader!./equatives/equative-explorer.mdx";

// @ts-ignore
import * as nounsGender from "!babel-loader!@lingdocs/mdx-loader!./nouns/nouns-gender.mdx";
// @ts-ignore
import * as nounsUnisex from "!babel-loader!@lingdocs/mdx-loader!./nouns/nouns-unisex.mdx";
// @ts-ignore
import * as nounsPlural from "!babel-loader!@lingdocs/mdx-loader!./nouns/nouns-plural.mdx";
// @ts-ignore
import * as arabicPlurals from "!babel-loader!@lingdocs/mdx-loader!./nouns/arabic-plurals.mdx";
// @ts-ignore
import * as bundledPlurals from "!babel-loader!@lingdocs/mdx-loader!./nouns/bundled-plurals.mdx";

// @ts-ignore
import * as BlocksAndKids from "!babel-loader!@lingdocs/mdx-loader!./phrase-structure/blocks-and-kids.mdx";
// @ts-ignore
import * as NPIntro from "!babel-loader!@lingdocs/mdx-loader!./phrase-structure/np.mdx";
// @ts-ignore
import * as APIntro from "!babel-loader!@lingdocs/mdx-loader!./phrase-structure/ap.mdx";
// @ts-ignore
import * as EPIntro from "!babel-loader!@lingdocs/mdx-loader!./phrase-structure/ep.mdx";
// @ts-ignore
import * as VPIntro from "!babel-loader!@lingdocs/mdx-loader!./phrase-structure/vp.mdx";
// @ts-ignore
import * as ShorteningVPs from "!babel-loader!@lingdocs/mdx-loader!./phrase-structure/shortening-vps.mdx";

// @ts-ignore
import * as verbAspect from "!babel-loader!@lingdocs/mdx-loader!./verbs/verb-aspect.mdx";
// @ts-ignore
import * as verbsIntro from "!babel-loader!@lingdocs/mdx-loader!./verbs/verbs-intro.mdx";
// @ts-ignore
import * as presentVerbs from "!babel-loader!@lingdocs/mdx-loader!./verbs/present-verbs.mdx";
// @ts-ignore
import * as subjunctiveVerbs from "!babel-loader!@lingdocs/mdx-loader!./verbs/subjunctive-verbs.mdx";
// @ts-ignore
import * as futureVerbs from "!babel-loader!@lingdocs/mdx-loader!./verbs/future-verbs.mdx";
// @ts-ignore
import * as imperativeVerbs from "!babel-loader!@lingdocs/mdx-loader!./verbs/imperative-verbs.mdx";
// @ts-ignore
import * as verbEndings from "!babel-loader!@lingdocs/mdx-loader!./verbs/verb-endings.mdx";
// @ts-ignore
import * as negativeVerbs from "!babel-loader!@lingdocs/mdx-loader!./verbs/negative.mdx";
// @ts-ignore
import * as rootsAndStems from "!babel-loader!@lingdocs/mdx-loader!./verbs/roots-and-stems.mdx";
// @ts-ignore
import * as pastVerbs from "!babel-loader!@lingdocs/mdx-loader!./verbs/past-verbs.mdx";
// @ts-ignore
import * as perfectVerbsIntro from "!babel-loader!@lingdocs/mdx-loader!./verbs/perfect-verbs-intro.mdx";
// @ts-ignore
import * as allPerfectVerbs from "!babel-loader!@lingdocs/mdx-loader!./verbs/all-perfect-verbs.mdx";

// @ts-ignore
import * as introToParticiples from "!babel-loader!@lingdocs/mdx-loader!./participles/intro.mdx";

// @ts-ignore
import * as pronounsBasic from "!babel-loader!@lingdocs/mdx-loader!./pronouns/pronouns-basic.mdx";
// @ts-ignore
import * as pronounsMini from "!babel-loader!@lingdocs/mdx-loader!./pronouns/pronouns-mini.mdx";
// @ts-ignore
import * as directionalPronouns from "!babel-loader!@lingdocs/mdx-loader!./pronouns/pronouns-directional.mdx"; 

// @ts-ignore
import * as inflectionIntro from "!babel-loader!@lingdocs/mdx-loader!./inflection/inflection-intro.mdx";
// @ts-ignore
import * as inflectionPatterns from "!babel-loader!@lingdocs/mdx-loader!./inflection/inflection-patterns.mdx";
// @ts-ignore
import * as feminineInflection from "!babel-loader!@lingdocs/mdx-loader!./inflection/feminine-inflection.mdx";

// @ts-ignore
import * as sandwiches from "!babel-loader!@lingdocs/mdx-loader!./sandwiches/sandwiches.mdx";

// @ts-ignore
import * as phonetics from "!babel-loader!@lingdocs/mdx-loader!./writing/phonetics.mdx";
// @ts-ignore
import * as diacritics from "!babel-loader!@lingdocs/mdx-loader!./writing/diacritics.mdx";
// @ts-ignore
import * as theFiveYeys from "!babel-loader!@lingdocs/mdx-loader!./writing/the-five-yeys.mdx";
// @ts-ignore
import * as typingIssues from "!babel-loader!@lingdocs/mdx-loader!./writing/typing-issues.mdx";

// @ts-ignore
import * as unrealConditionals from "!babel-loader!@lingdocs/mdx-loader!./recipes/unreal-conditionals.mdx";

// @ts-ignore
import * as games from "!babel-loader!@lingdocs/mdx-loader!./games.mdx";

// @ts-ignore
import * as pronounPicker from "!babel-loader!@lingdocs/mdx-loader!./practice-tools/pronoun-picker.mdx";
// @ts-ignore
import * as phraseBuilder from "!babel-loader!@lingdocs/mdx-loader!./practice-tools/phrase-builder.mdx";

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
                import: habitualEquative,
                slug: "habitual-equative",
            },
            {
                import: otherEquatives,
                slug: "other-equatives",
            },
            {
                import: equativeExplorer,
                slug: "equative-explorer",
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
        heading: "Phrase Structure 🧱",
        subdirectory: "phrase-structure",
        chapters: [
            {
                import: BlocksAndKids,
                slug: "blocks-and-kids",
            },
            {
                import: NPIntro,
                slug: "np",
            },
            {
                import: APIntro,
                slug: "ap",
            },
            {
                import: EPIntro,
                slug: "ep",
            },
            {
                import: VPIntro,
                slug: "vp",
            },
            {
                import: ShorteningVPs,
                slug: "shortening-vps",
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
                import: pastVerbs,
                slug: "past-verbs",
            },
            {
                import: perfectVerbsIntro,
                slug: "perfect-verbs-intro",
            },
            {
                import: allPerfectVerbs,
                slug: "all-perfect-verbs",
            },
            {
                import: negativeVerbs,
                slug: "negative-verbs",
            },
            {
                import: verbEndings,
                slug: "verb-endings",
            },
        ],
    },
    {
        heading: "Participles",
        subdirectory: "participles",
        chapters: [
            {
                import: introToParticiples,
                slug: "intro",
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
                import: phonetics,
                slug: "phonetics",
            },
            {
                import: diacritics,
                slug: "diacritics",
            },
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
    {
        heading: "Recipes 👩‍🍳",
        subdirectory: "recipes",
        chapters: [
            {
                import: unrealConditionals,
                slug: "unreal-conditionals",
            },
        ],
    },
    {
        import: games,
        slug: "games",
    },
    {
        heading: "Practice Tools 🔧",
        subdirectory: "practice-tools",
        chapters: [
            {
                import: pronounPicker,
                slug: "pronoun-picker",
            },
            {
                import: phraseBuilder,
                slug: "phrase-builder",
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

