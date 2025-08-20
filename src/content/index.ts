import type { MDXContent, MDXModule } from "mdx/types";

import * as intro from "./intro.mdx";

import * as presentEquative from "./equatives/present-equative.mdx";
import * as habitualEquative from "./equatives/habitual-equative.mdx";
import * as otherEquatives from "./equatives/other-equatives.mdx";

import * as nounsGender from "./nouns/nouns-gender.mdx";
import * as nounsUnisex from "./nouns/nouns-unisex.mdx";
import * as nounsPlural from "./nouns/nouns-plural.mdx";
import * as specialPlurals from "./nouns/special-plurals.mdx";
import * as bundledPlurals from "./nouns/bundled-plurals.mdx";
import * as determiners from "./nouns/determiners.mdx";
import * as demonstratives from "./nouns/demonstratives.mdx";

import * as BlocksAndKids from "./phrase-structure/blocks-and-kids.mdx";
import * as NPIntro from "./phrase-structure/np.mdx";
import * as APIntro from "./phrase-structure/ap.mdx";
import * as EPIntro from "./phrase-structure/ep.mdx";
import * as VPIntro from "./phrase-structure/vp.mdx";
import * as Complement from "./phrase-structure/complement.mdx";
import * as ShorteningVPs from "./phrase-structure/shortening-vps.mdx";

import * as verbAspect from "./verbs/verb-aspect.mdx";
import * as verbsIntro from "./verbs/verbs-intro.mdx";
import * as presentVerbs from "./verbs/present-verbs.mdx";
import * as subjunctiveVerbs from "./verbs/subjunctive-verbs.mdx";
import * as futureVerbs from "./verbs/future-verbs.mdx";
import * as imperativeVerbs from "./verbs/imperative-verbs.mdx";
import * as verbEndings from "./verbs/verb-endings.mdx";
import * as negativeVerbs from "./verbs/negative.mdx";
import * as rootsAndStems from "./verbs/roots-and-stems.mdx";
import * as pastVerbs from "./verbs/past-verbs.mdx";
import * as perfectVerbsIntro from "./verbs/perfect-verbs-intro.mdx";
import * as allPerfectVerbs from "./verbs/all-perfect-verbs.mdx";
import * as passiveVoice from "./verbs/passive-voice.mdx";
import * as ability from "./verbs/ability.mdx";
import * as masterChart from "./verbs/master-chart.mdx";
import * as jussive from "./verbs/jussive.mdx";

import * as compoundVerbsIntro from "./compound-verbs/intro.mdx";
import * as helperVerbs from "./compound-verbs/helper-verbs.mdx";
import * as stativeCompounds from "./compound-verbs/stative-compounds.mdx";
import * as dynamicCompounds from "./compound-verbs/dynamic-compounds.mdx";
import * as moreOnCompounds from "./compound-verbs/more-on-compounds.mdx";

import * as introToParticiples from "./participles/intro.mdx";

import * as pronounsBasic from "./pronouns/pronouns-basic.mdx";
import * as pronounsIndefinite from "./pronouns/pronouns-indefinite.mdx";
import * as pronounsMini from "./pronouns/pronouns-mini.mdx";
import * as directionalPronouns from "./pronouns/pronouns-directional.mdx";

import * as inflectionIntro from "./inflection/inflection-intro.mdx";
import * as inflectionPatterns from "./inflection/inflection-patterns.mdx";
import * as vocative from "./inflection/vocative.mdx";
import * as mayonnaise from "./inflection/mayonnaise.mdx";

import * as sandwiches from "./sandwiches/sandwiches.mdx";

import * as phonetics from "./writing/phonetics.mdx";
import * as diacritics from "./writing/diacritics.mdx";
import * as theFiveYeys from "./writing/the-five-yeys.mdx";
import * as typingIssues from "./writing/typing-issues.mdx";
import * as minimalPairs from "./writing/minimal-pairs.mdx";

import * as unrealConditionals from "./recipes/unreal-conditionals.mdx";

import * as games from "./games.mdx";

import * as pronounPicker from "./practice-tools/pronoun-picker.mdx";

import * as phraseBuilder from "./phrase-builder.mdx";

import * as dictionary from "./dictionary.mdx";

// DO NOT CHANGE THIS STATEMENT OR VARIABLE NAME
// WE NEED THEM TO BE ABLE TO GRAB AND THEN PARSE THE CONTENT TREE ELSEWHERE
// IT MUST BE THE FIRST STATEMENT AFTER THE IMPORTS
export const contentTree: (ChapterSection | ChaptersSection)[] = [
  {
    import: intro,
    slug: "intro",
  },
  {
    import: games,
    slug: "games",
  },
  {
    import: phraseBuilder,
    slug: "phrase-builder",
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
        import: vocative,
        slug: "vocative",
      },
      {
        import: mayonnaise,
        slug: "mayonnaise",
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
        import: specialPlurals,
        slug: "special-plurals",
      },
      {
        import: bundledPlurals,
        slug: "bundled-plurals",
      },
      {
        import: determiners,
        slug: "determiners",
      },
      {
        import: demonstratives,
        slug: "demonstratives",
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
        import: pronounsIndefinite,
        slug: "pronouns-indefinate",
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
        import: Complement,
        slug: "complement",
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
        import: ability,
        slug: "ability",
      },
      {
        import: jussive,
        slug: "jussive",
      },
      {
        import: passiveVoice,
        slug: "passive-voice",
      },
      {
        import: verbEndings,
        slug: "verb-endings",
      },
      {
        import: masterChart,
        slug: "master-chart",
      },
    ],
  },
  {
    heading: "Compound Verbs",
    subdirectory: "compound-verbs",
    chapters: [
      {
        import: compoundVerbsIntro,
        slug: "intro",
      },
      {
        import: helperVerbs,
        slug: "helper-verbs",
      },
      {
        import: stativeCompounds,
        slug: "stative-compounds",
      },
      {
        import: dynamicCompounds,
        slug: "dynamic-compounds",
      },
      {
        import: moreOnCompounds,
        slug: "more-on-compounds",
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
      {
        import: minimalPairs,
        slug: "minimal-pairs",
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
    heading: "Practice Tools 🔧",
    subdirectory: "practice-tools",
    chapters: [
      {
        import: pronounPicker,
        slug: "pronoun-picker",
      },
    ],
  },
  {
    import: dictionary,
    slug: "dictionary",
  },
];

type ChapterSection = {
  import: MDXModule;
  slug: string;
};

type ChaptersSection = {
  heading: string;
  subdirectory: string;
  chapters: ChapterSection[];
};

type FrontMatter = {
  title: string;
  fullWidth?: boolean;
};

export type TOCData = TOCItem[];

type TOCItem = {
  depth: number;
  value: string;
  id: string;
  children?: TOCItem[];
};

type NeighbourData = {
  frontMatter: FrontMatter;
  path: string;
};

export type ChapterData = {
  type: "chapter-data";
  path: string;
  slug: string;
  content: MDXContent;
  frontMatter: FrontMatter;
  tableOfContents: TOCData;
  next?: NeighbourData;
  prev?: NeighbourData;
};

export type SectionData = {
  type: "section-data";
  heading: string;
  subdirectory: string;
  chapters: ChapterData[];
};

export const content = contentTree.map(firstStep).map(addNeighbourData);

function firstStep(
  item: ChapterSection | ChaptersSection,
): ChapterData | SectionData {
  function prepareChapter(
    chp: ChapterSection,
    subdir: string | undefined,
  ): ChapterData {
    return {
      type: "chapter-data",
      path: subdir ? `/${subdir}/${chp.slug}/` : `/${chp.slug}/`,
      slug: chp.slug,
      content: chp.import.default,
      frontMatter: chp.import.frontMatter as FrontMatter,
      tableOfContents: chp.import.tableOfContents as TOCData,
    };
  }

  return "import" in item
    ? prepareChapter(item, undefined)
    : {
        ...item,
        type: "section-data",
        chapters: item.chapters.map((c) =>
          prepareChapter(c, item.subdirectory),
        ),
      };
}

function addNeighbourData(
  item: ChapterData | SectionData,
  i: number,
  items: (ChapterData | SectionData)[],
): ChapterData | SectionData {
  if (item.type === "chapter-data") {
    return withNextPrev(item, i, undefined, items, []);
  }
  return {
    ...item,
    chapters: item.chapters.map((chapter, j, chapters) =>
      withNextPrev(chapter, i, j, items, chapters),
    ),
  };
}

function withNextPrev(
  current: ChapterData,
  i: number,
  j: number | undefined,
  items: (ChapterData | SectionData)[],
  chapters: ChapterData[],
) {
  function getInfo(x: ChapterData | undefined): NeighbourData | undefined {
    if (!x) {
      return undefined;
    }
    return { frontMatter: x.frontMatter, path: x.path };
  }
  function getNext(): ChapterData | undefined {
    const next =
      j !== undefined ? chapters[j + 1] || items[i + 1] : items[i + 1];
    if (!next) {
      return undefined;
    }
    if (next.type === "chapter-data") {
      return next;
    }
    return next.chapters[0];
  }
  function getPrev(): ChapterData | undefined {
    const prev =
      j !== undefined ? chapters[j - 1] || items[i - 1] : items[i - 1];
    if (!prev) {
      return undefined;
    }
    if (prev.type === "chapter-data") {
      return prev;
    }
    return prev.chapters.at(-1);
  }
  return {
    ...current,
    // could make an applicative to use here hehe 🤓
    prev: getInfo(getPrev()),
    next: getInfo(getNext()),
  };
}
