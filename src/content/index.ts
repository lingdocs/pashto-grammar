/**
 * Copyright (c) 2021 lingdocs.com
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable import/no-webpack-loader-syntax */
// @ts-ignore
import * as intro from "./intro.mdx";

// @ts-ignore
import * as presentEquative from "./equatives/present-equative.mdx";
// @ts-ignore
import * as habitualEquative from "./equatives/habitual-equative.mdx";
// @ts-ignore
import * as otherEquatives from "./equatives/other-equatives.mdx";

// @ts-ignore
import * as nounsGender from "./nouns/nouns-gender.mdx";
// @ts-ignore
import * as nounsUnisex from "./nouns/nouns-unisex.mdx";
// @ts-ignore
import * as nounsPlural from "./nouns/nouns-plural.mdx";
// @ts-ignore
import * as specialPlurals from "./nouns/special-plurals.mdx";
// @ts-ignore
import * as bundledPlurals from "./nouns/bundled-plurals.mdx";
// @ts-ignore
import * as determiners from "./nouns/determiners.mdx";
// @ts-ignore
import * as demonstratives from "./nouns/demonstratives.mdx";

// @ts-ignore
import * as BlocksAndKids from "./phrase-structure/blocks-and-kids.mdx";
// @ts-ignore
import * as NPIntro from "./phrase-structure/np.mdx";
// @ts-ignore
import * as APIntro from "./phrase-structure/ap.mdx";
// @ts-ignore
import * as EPIntro from "./phrase-structure/ep.mdx";
// @ts-ignore
import * as VPIntro from "./phrase-structure/vp.mdx";
// @ts-ignore
import * as Complement from "./phrase-structure/complement.mdx";
// @ts-ignore
import * as ShorteningVPs from "./phrase-structure/shortening-vps.mdx";

// @ts-ignore
import * as verbAspect from "./verbs/verb-aspect.mdx";
// @ts-ignore
import * as verbsIntro from "./verbs/verbs-intro.mdx";
// @ts-ignore
import * as presentVerbs from "./verbs/present-verbs.mdx";
// @ts-ignore
import * as subjunctiveVerbs from "./verbs/subjunctive-verbs.mdx";
// @ts-ignore
import * as futureVerbs from "./verbs/future-verbs.mdx";
// @ts-ignore
import * as imperativeVerbs from "./verbs/imperative-verbs.mdx";
// @ts-ignore
import * as verbEndings from "./verbs/verb-endings.mdx";
// @ts-ignore
import * as negativeVerbs from "./verbs/negative.mdx";
// @ts-ignore
import * as rootsAndStems from "./verbs/roots-and-stems.mdx";
// @ts-ignore
import * as pastVerbs from "./verbs/past-verbs.mdx";
// @ts-ignore
import * as perfectVerbsIntro from "./verbs/perfect-verbs-intro.mdx";
// @ts-ignore
import * as allPerfectVerbs from "./verbs/all-perfect-verbs.mdx";
// @ts-ignore
import * as passiveVoice from "./verbs/passive-voice.mdx";
// @ts-ignore
import * as ability from "./verbs/ability.mdx";
// @ts-ignore
import * as masterChart from "./verbs/master-chart.mdx";
// @ts-ignore
import * as jussive from "./verbs/jussive.mdx";

// @ts-ignore
import * as compoundVerbsIntro from "./compound-verbs/intro.mdx";
// @ts-ignore
import * as helperVerbs from "./compound-verbs/helper-verbs.mdx";
// @ts-ignore
import * as stativeCompounds from "./compound-verbs/stative-compounds.mdx";
// @ts-ignore
import * as dynamicCompounds from "./compound-verbs/dynamic-compounds.mdx";
// @ts-ignore
import * as moreOnCompounds from "./compound-verbs/more-on-compounds.mdx";

// @ts-ignore
import * as introToParticiples from "./participles/intro.mdx";

// @ts-ignore
import * as pronounsBasic from "./pronouns/pronouns-basic.mdx";
// @ts-ignore
import * as pronounsMini from "./pronouns/pronouns-mini.mdx";
// @ts-ignore
import * as directionalPronouns from "./pronouns/pronouns-directional.mdx";

// @ts-ignore
import * as inflectionIntro from "./inflection/inflection-intro.mdx";
// @ts-ignore
import * as inflectionPatterns from "./inflection/inflection-patterns.mdx";
// @ts-ignore
import * as vocative from "./inflection/vocative.mdx";

// @ts-ignore
import * as sandwiches from "./sandwiches/sandwiches.mdx";

// @ts-ignore
import * as phonetics from "./writing/phonetics.mdx";
// @ts-ignore
import * as diacritics from "./writing/diacritics.mdx";
// @ts-ignore
import * as theFiveYeys from "./writing/the-five-yeys.mdx";
// @ts-ignore
import * as typingIssues from "./writing/typing-issues.mdx";

// @ts-ignore
import * as unrealConditionals from "./recipes/unreal-conditionals.mdx";

// @ts-ignore
import * as games from "./games.mdx";

// @ts-ignore
import * as pronounPicker from "./practice-tools/pronoun-picker.mdx";

// @ts-ignore
import * as phraseBuilder from "./phrase-builder.mdx";

// @ts-ignore
import * as dictionary from "./dictionary.mdx";

type ChapterSection = {
  "import": any;
  "slug": string;
};
type ChaptersSection = {
  "heading": string;
  "subdirectory": string;
  "chapters": ChapterSection[];
};

// for the super hacky sitemap generator to work this array needs to be
// - in valid JSON and surrounded by these comments
// - the import statements have to be at the top of the objects in a seperate line
export const contentTree: (ChapterSection | ChaptersSection)[] =
  /* content-tree */ [
    {
      "import": intro,
      "slug": "intro"
    },
    {
      "import": games,
      "slug": "games"
    },
    {
      "import": phraseBuilder,
      "slug": "phrase-builder"
    },
    {
      "heading": "Equatives",
      "subdirectory": "equatives",
      "chapters": [
        {
          "import": presentEquative,
          "slug": "present-equative"
        },
        {
          "import": habitualEquative,
          "slug": "habitual-equative"
        },
        {
          "import": otherEquatives,
          "slug": "other-equatives"
        }
      ]
    },
        {
      "heading": "Inflection 🔘",
      "subdirectory": "inflection",
      "chapters": [
        {
          "import": inflectionIntro,
          "slug": "inflection-intro"
        },
        {
          "import": inflectionPatterns,
          "slug": "inflection-patterns"
        },
        {
          "import": vocative,
          "slug": "vocative"
        }
      ]
    },
    {
      "heading": "Nouns",
      "subdirectory": "nouns",
      "chapters": [
        {
          "import": nounsGender,
          "slug": "nouns-gender"
        },
        {
          "import": nounsUnisex,
          "slug": "nouns-unisex"
        },
        {
          "import": nounsPlural,
          "slug": "nouns-plural"
        },
        {
          "import": specialPlurals,
          "slug": "special-plurals"
        },
        {
          "import": bundledPlurals,
          "slug": "bundled-plurals"
        },
        {
          "import": determiners,
          "slug": "determiners"
        },
        {
          "import": demonstratives,
          "slug": "demonstratives"
        }
      ]
    },
    {
      "heading": "Pronouns",
      "subdirectory": "pronouns",
      "chapters": [
        {
          "import": pronounsBasic,
          "slug": "pronouns-basic"
        },
        {
          "import": pronounsMini,
          "slug": "pronouns-mini"
        },
        {
          "import": directionalPronouns,
          "slug": "pronouns-directional"
        },
        {
          "import": demonstratives,
          "slug": "demonstratives"
        }
      ]
    },
    {
      "heading": "Phrase Structure 🧱",
      "subdirectory": "phrase-structure",
      "chapters": [
        {
          "import": BlocksAndKids,
          "slug": "blocks-and-kids"
        },
        {
          "import": NPIntro,
          "slug": "np"
        },
        {
          "import": APIntro,
          "slug": "ap"
        },
        {
          "import": EPIntro,
          "slug": "ep"
        },
        {
          "import": VPIntro,
          "slug": "vp"
        },
        {
          "import": Complement,
          "slug": "complement"
        },
        {
          "import": ShorteningVPs,
          "slug": "shortening-vps"
        }
      ]
    },
    {
      "heading": "Verbs",
      "subdirectory": "verbs",
      "chapters": [
        {
          "import": verbsIntro,
          "slug": "verbs-intro"
        },
        {
          "import": verbAspect,
          "slug": "verb-aspect"
        },
        {
          "import": rootsAndStems,
          "slug": "roots-and-stems"
        },
        {
          "import": presentVerbs,
          "slug": "present-verbs"
        },
        {
          "import": subjunctiveVerbs,
          "slug": "subjunctive-verbs"
        },
        {
          "import": futureVerbs,
          "slug": "future-verbs"
        },
        {
          "import": imperativeVerbs,
          "slug": "imperative-verbs"
        },
        {
          "import": pastVerbs,
          "slug": "past-verbs"
        },
        {
          "import": perfectVerbsIntro,
          "slug": "perfect-verbs-intro"
        },
        {
          "import": allPerfectVerbs,
          "slug": "all-perfect-verbs"
        },
        {
          "import": negativeVerbs,
          "slug": "negative-verbs"
        },
        {
          "import": ability,
          "slug": "ability"
        },
        {
          "import": jussive,
          "slug": "jussive"
        },
        {
          "import": passiveVoice,
          "slug": "passive-voice"
        },
        {
          "import": verbEndings,
          "slug": "verb-endings"
        },
        {
          "import": masterChart,
          "slug": "master-chart"
        }
      ]
    },
    {
      "heading": "Compound Verbs",
      "subdirectory": "compound-verbs",
      "chapters": [
        {
          "import": compoundVerbsIntro,
          "slug": "intro"
        },
        {
          "import": helperVerbs,
          "slug": "helper-verbs"
        },
        {
          "import": stativeCompounds,
          "slug": "stative-compounds"
        },
        {
          "import": dynamicCompounds,
          "slug": "dynamic-compounds"
        },
        {
          "import": moreOnCompounds,
          "slug": "more-on-compounds"
        }
      ]
    },
    {
      "heading": "Participles",
      "subdirectory": "participles",
      "chapters": [
        {
          "import": introToParticiples,
          "slug": "intro"
        }
      ]
    },
    {
      "heading": "Sandwiches 🥪",
      "subdirectory": "sandwiches",
      "chapters": [
        {
          "import": sandwiches,
          "slug": "sandwiches"
        }
      ]
    },
    {
      "heading": "Writing 🖊",
      "subdirectory": "writing",
      "chapters": [
        {
          "import": phonetics,
          "slug": "phonetics"
        },
        {
          "import": diacritics,
          "slug": "diacritics"
        },
        {
          "import": theFiveYeys,
          "slug": "the-five-yeys"
        },
        {
          "import": typingIssues,
          "slug": "typing-issues"
        }
      ]
    },
    {
      "heading": "Recipes 👩‍🍳",
      "subdirectory": "recipes",
      "chapters": [
        {
          "import": unrealConditionals,
          "slug": "unreal-conditionals"
        }
      ]
    },
    {
      "heading": "Practice Tools 🔧",
      "subdirectory": "practice-tools",
      "chapters": [
        {
          "import": pronounPicker,
          "slug": "pronoun-picker"
        }
      ]
    },
    {
      "import": dictionary,
      "slug": "dictionary"
    }
  ] /* content-tree */

export const content = contentTree
  .map((item) => {
    function prepareChapter(chp: any, subdir?: any) {
      return {
        path: subdir ? `/${subdir}/${chp.slug}/` : `/${chp.slug}/`,
        "slug": chp.slug,
        content: chp.import.default,
        frontMatter: chp.import.frontMatter,
        tableOfContents: chp.import.tableOfContents,
      };
    }
    return "import" in item
      ? prepareChapter(item)
      : {
          ...item,
          "chapters": item.chapters?.map((c) => {
            return prepareChapter(c, item.subdirectory);
          }),
        };
  })
  .map((item, i, items) => {
    // make the next and previous page information for each chapter
    function withNextPrev(current: any, index: any, arr: any) {
      function getInfo(x: any) {
        return x.content
          ? { frontMatter: x.frontMatter, path: x.path }
          : {
              frontMatter: x.chapters[0].frontMatter,
              path: x.chapters[0].path,
            }; // TODO: KILL THIS?
      }
      function getNextOutsideItem() {
        // @ts-ignore
        return items[i + 1].content
          ? // if it's a single chapter section, get that chapter
            items[i + 1]
          : // if it's a section with multiple chapters, get the first chapter
            // @ts-ignore
            items[i + 1].chapters[0];
      }
      function getPrevOutsideItem() {
        // @ts-ignore
        return items[i - 1].content
          ? // if it's a single chapter section, get that chapter
            items[i - 1]
          : // if it's a section with multiple chapters, get the last chapter
            // @ts-ignore
            items[i - 1].chapters[items[i - 1].chapters.length - 1];
      }
      const next =
        index < arr.length - 1
          ? // if there's another chapter in this section, that's the next one
            arr[index + 1]
          : // no? maybe there's another chapter or section in front of us
          i < items.length - 1
          ? getNextOutsideItem()
          : false;
      const prev =
        index !== 0
          ? // if there's another chapter in this section, that's the previous one
            arr[index - 1]
          : // no? maybe we there's a chapter or section behind us
          i !== 0
          ? getPrevOutsideItem()
          : false;
      return {
        ...current,
        ...(prev
          ? {
              prev: getInfo(prev),
            }
          : {}),
        ...(next
          ? {
              next: getInfo(next),
            }
          : {}),
      };
    }
    // @ts-ignore
    if (item.content) {
      return withNextPrev(item, i, items);
    }
    return {
      ...item,
      // @ts-ignore
      "chapters": item.chapters.map((chapter, j, chapters) =>
        withNextPrev(chapter, j, chapters)
      ),
    };
  });
