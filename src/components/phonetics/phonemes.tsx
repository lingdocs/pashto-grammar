import { Types as T } from "@lingdocs/ps-react";

interface ILetter {
  letter: string;
  starting?: string[];
  index: number;
  loanReplacement?: string;
  alternate?: string;
  middle?: string;
}

interface IAlphabet {
  alif: ILetter;
  be: ILetter;
  pe: ILetter;
  te: ILetter;
  Te: ILetter;
  se: ILetter;
  jeem: ILetter;
  che: ILetter;
  he: ILetter;
  khe: ILetter;
  tse: ILetter;
  dzeem: ILetter;
  daal: ILetter;
  Daal: ILetter;
  zaal: ILetter;
  re: ILetter;
  Re: ILetter;
  ze: ILetter;
  jze: ILetter;
  Ge: ILetter;
  seen: ILetter;
  sheen: ILetter;
  xeen: ILetter;
  swaad: ILetter;
  zwaad: ILetter;
  twe: ILetter;
  zwe: ILetter;
  ayn: ILetter;
  ghayn: ILetter;
  fe: ILetter;
  qaaf: ILetter;
  kaaf: ILetter;
  gaaf: ILetter;
  laam: ILetter;
  meem: ILetter;
  noon: ILetter;
  Noon: ILetter;
  waaw: ILetter;
  gurdaHe: ILetter;
  klakaYe: ILetter;
  pastaYe: ILetter;
  naareenaYe: ILetter;
  xudzeenaYe: ILetter;
  faailiyaYe: ILetter;
}

export const letters: IAlphabet = {
  alif: { letter: "ا", starting: ["آ", "ا"], index: 0 },
  be: { letter: "ب", index: 1 },
  pe: { letter: "پ", index: 2 },
  te: { letter: "ت", index: 3 },
  Te: { letter: "ټ", index: 4 },
  se: { letter: "ث", index: 5, loanReplacement: "س" },
  jeem: { letter: "ج", index: 6 },
  che: { letter: "چ", index: 7 },
  he: { letter: "ح", index: 8 },
  khe: { letter: "خ", index: 9 },
  tse: { letter: "څ", index: 10 },
  dzeem: { letter: "ځ", index: 11 },
  daal: { letter: "د", index: 12 },
  Daal: { letter: "ډ", index: 13 },
  zaal: { letter: "ذ", index: 14, loanReplacement: "ز" },
  re: { letter: "ر", index: 15 },
  Re: { letter: "ړ", index: 16 },
  ze: { letter: "ز", index: 17 },
  jze: { letter: "ژ", index: 18 },
  Ge: { letter: "ږ", index: 19 },
  seen: { letter: "س", index: 20 },
  sheen: { letter: "ش", index: 21 },
  xeen: { letter: "ښ", index: 22 },
  swaad: { letter: "ص", index: 23, loanReplacement: "س" },
  zwaad: { letter: "ض", index: 24, loanReplacement: "ز" },
  twe: { letter: "ط", index: 25, loanReplacement: "ت" },
  zwe: { letter: "ظ", index: 26, loanReplacement: "ز" },
  ayn: { letter: "ع", index: 27, loanReplacement: "" },
  ghayn: { letter: "غ", index: 28 },
  fe: { letter: "ف", index: 29 },
  qaaf: { letter: "ق", index: 30 },
  kaaf: { letter: "ک", index: 31 },
  gaaf: { letter: "ګ", index: 32, alternate: "گ" },
  laam: { letter: "ل", index: 33 },
  meem: { letter: "م", index: 34 },
  noon: { letter: "ن", index: 35 },
  Noon: { letter: "ڼ", index: 36 },
  waaw: { letter: "و", index: 37 },
  gurdaHe: { letter: "ه", index: 38 },
  klakaYe: { letter: "ي", middle: "ی", index: 39 },
  pastaYe: { letter: "ې", index: 40 },
  naareenaYe: { letter: "ی", index: 41 },
  xudzeenaYe: { letter: "ۍ", index: 42 },
  faailiyaYe: { letter: "ئ", index: 43 },
};

export const diacritics = {
  zwar: "َ",
  zwarakay: "ٙ",
  zer: "ِ",
  pesh: "ُ",
  sukun: "ْ",
  hamzaAbove: "ٔ",
  tashdeed: "ّ",
  wasla: "ٱ",
  daggerAlif: "ٰ",
  fathahan: "ً",
};

export type PhonemeExample = T.PsString & {
  pHighlight: number[][];
  fHighlight: number[][];
  a?: string;
  audio?: { externalLink: string };
};

export type Phoneme = {
  phoneme: string;
  a?: string;
  quickExplanation: string | JSX.Element;
  specialConsonant?: boolean;
  shortVowel?: boolean;
  longVowel?: boolean;
  addAlefToStart?: boolean;
  fiveYs?: boolean;
  canBeIgnored?: boolean;
  ipa: any;
  onlyOnEnd?: boolean;
  endingLetter?: ILetter;
  examples: PhonemeExample[];
} & ({ possibleLetters: ILetter[] } | { diacritic: string });

export const phonemes = [
  // consonants
  {
    phoneme: "b",
    quickExplanation: (
      <>
        b in <strong>b</strong>at
      </>
    ),
    possibleLetters: [letters.be],
    ipa: {
      letter: "b",
    },
    examples: [
      {
        p: "باد",
        f: "baad",
        e: "wind",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 0]],
        a: "baad",
      },
      {
        p: "باتور",
        f: "baatoor",
        e: "courageous",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 0]],
      },
    ],
  },
  {
    phoneme: "p",
    possibleLetters: [letters.pe],
    quickExplanation: (
      <>
        p in <strong>p</strong>ost
      </>
    ),
    ipa: {
      letter: "p",
    },
    examples: [
      {
        p: "پوزه",
        f: "poza",
        e: "Pashto",
        a: "poza",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 0]],
      },
    ],
  },
  {
    phoneme: "t",
    a: "t",
    possibleLetters: [letters.te],
    quickExplanation: (
      <>
        t but further forward on teeth, like th in <strong>th</strong>ick
      </>
    ),
    specialConsonant: true,
    ipa: {
      letter: "t̪",
      video: "https://www.youtube.com/watch?v=lxGKDZc-30g",
    },
    examples: [
      {
        p: "تور",
        f: "tor",
        e: "black",
        a: "tor",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 0]],
      },
    ],
  },
  {
    phoneme: "T",
    a: "tt",
    possibleLetters: [letters.Te],
    quickExplanation: "retroflex t",
    specialConsonant: true,
    ipa: {
      letter: "ʈ",
      video: "https://www.youtube.com/watch?v=evYnoRnbyxo",
    },
    examples: [
      {
        p: "مالټه",
        f: "maalTa",
        e: "orange (fruit)",
        a: "maaltta",
        pHighlight: [[3, 3]],
        fHighlight: [[4, 4]],
      },
    ],
  },
  {
    phoneme: "j",
    possibleLetters: [letters.jeem],
    quickExplanation: (
      <>
        j in <strong>j</strong>ar
      </>
    ),
    ipa: {
      letter: "ʤ",
      video: "https://www.youtube.com/watch?v=vqL9ivPb09A",
    },
    examples: [
      {
        p: "جوړ",
        f: "joR",
        e: "well",
        a: "jorr",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 0]],
      },
      {
        p: "جامې",
        f: "jaame",
        e: "clothes",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 0]],
      },
    ],
  },
  {
    phoneme: "ch",
    possibleLetters: [letters.che],
    quickExplanation: (
      <>
        ch in <strong>ch</strong>ance
      </>
    ),
    ipa: {
      letter: "tʃ",
    },
    examples: [
      {
        p: "چا",
        f: "chaa",
        e: "whom",
        a: "chaa",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 1]],
      },
      {
        p: "چرت",
        f: "chUrt",
        e: "thought, worry",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 1]],
      },
    ],
  },
  {
    phoneme: "h",
    a: "h",
    possibleLetters: [letters.he],
    quickExplanation: (
      <>
        h in <strong>h</strong>ow
      </>
    ),
    ipa: {
      letter: "h",
    },
    examples: [
      {
        p: "حلات",
        f: "haláat",
        a: "halaat",
        e: "circumstances",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 0]],
      },
      {
        p: "کهول",
        f: "kahól",
        e: "family, kindred",
        pHighlight: [[1, 1]],
        fHighlight: [[2, 2]],
      },
    ],
  },
  {
    phoneme: "kh",
    a: "kh",
    possibleLetters: [letters.khe],
    quickExplanation: (
      <>
        guttural sound like lo<strong>ch</strong>
      </>
    ),
    specialConsonant: true,
    ipa: {
      letter: "χ (Long-X)",
      video: "https://youtu.be/y5AizU69VOA?t=36",
    },
    examples: [
      {
        p: "خوښ",
        f: "khwux",
        e: "pleasure",
        a: "khwux",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 1]],
      },
    ],
  },
  {
    phoneme: "ts",
    a: "ts",
    possibleLetters: [letters.tse],
    quickExplanation: (
      <>
        similar to ts in i<strong>ts</strong>
      </>
    ),
    specialConsonant: true,
    ipa: {
      letter: "t͡s",
    },
    examples: [
      {
        p: "څومره",
        f: "tsomra",
        e: "how much",
        a: "tsomra",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 1]],
      },
    ],
  },
  {
    phoneme: "dz",
    a: "dz",
    possibleLetters: [letters.dzeem],
    quickExplanation: (
      <>
        similar to ds in la<strong>ds</strong>
      </>
    ),
    specialConsonant: true,
    ipa: {
      letter: "d͡z",
    },
    examples: [
      {
        p: "ځنګل",
        f: "dzungul",
        e: "jungle/forest",
        a: "dzungul",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 1]],
      },
    ],
  },
  {
    phoneme: "d",
    a: "d",
    possibleLetters: [letters.daal],
    quickExplanation: (
      <>
        d but further forward on teeth, almost like th in wea<strong>th</strong>
        er
      </>
    ),
    specialConsonant: true,
    ipa: {
      letter: "d̪",
      video: "https://www.youtube.com/watch?v=S2QNn26uDP8",
    },
    examples: [
      {
        p: "دوه",
        f: "dwa",
        e: "two",
        a: "dwa",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 0]],
      },
    ],
  },
  {
    phoneme: "D",
    a: "dd",
    possibleLetters: [letters.Daal],
    quickExplanation: "retroflex d",
    specialConsonant: true,
    ipa: {
      letter: "ɖ",
      video: "https://www.youtube.com/watch?v=nU7H_aiG-kc",
    },
    examples: [
      {
        p: "ډوډۍ",
        f: "DoDuy",
        e: "bread, food",
        a: "ddodduy",
        pHighlight: [
          [0, 0],
          [2, 2],
        ],
        fHighlight: [
          [0, 0],
          [2, 2],
        ],
      },
    ],
  },
  {
    phoneme: "z",
    possibleLetters: [letters.ze, letters.zaal, letters.zwaad, letters.zwe],
    quickExplanation: (
      <>
        z in <strong>z</strong>ebra
      </>
    ),
    ipa: {
      letter: "z",
    },
    examples: [
      {
        p: "پوزه",
        f: "poza",
        e: "Pashto",
        a: "poza",
        pHighlight: [[2, 2]],
        fHighlight: [[2, 2]],
      },
      {
        p: "زاري",
        f: "zaaree",
        e: "plea",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 0]],
      },
      {
        p: "ظاهر",
        f: "zaahir",
        e: "apparent",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 0]],
      },
    ],
  },
  {
    phoneme: "r",
    a: "r",
    possibleLetters: [letters.re],
    quickExplanation: "a lightly rolled/tapped/flapped r",
    specialConsonant: true,
    ipa: {
      letter: "ɾ, r̪",
      video: "https://www.youtube.com/watch?v=J0IYx-WGebg",
    },
    examples: [
      {
        p: "رنګ",
        f: "rang",
        e: "colour",
        a: "rang",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 0]],
      },
    ],
  },
  {
    phoneme: "R",
    a: "rr",
    possibleLetters: [letters.Re],
    quickExplanation: "a retroflex r",
    specialConsonant: true,
    ipa: {
      letter: "ɭ̆",
      video: "https://www.youtube.com/watch?v=JN3Z6K8Idm4",
    },
    examples: [
      {
        p: "جوړ",
        f: "joR",
        e: "well",
        a: "jorr",
        pHighlight: [[2, 2]],
        fHighlight: [[2, 2]],
      },
    ],
  },
  {
    phoneme: "jz",
    a: "jz",
    possibleLetters: [letters.jze],
    quickExplanation: (
      <>
        sei<strong>z</strong>ure
      </>
    ),
    ipa: {
      letter: "ʒ, d͡z",
    },
    examples: [
      {
        p: "ژوند",
        f: "jzwund",
        a: "jzwund",
        e: "life",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 1]],
      },
    ],
  },
  {
    phoneme: "G",
    possibleLetters: [letters.Ge],
    quickExplanation: "g in eastern dialect, retroflex jz in southern",
    specialConsonant: true,
    ipa: {
      letter: "ɡ",
    },
    examples: [
      {
        p: "وږی",
        f: "wuGay",
        e: "hungry",
        a: "wuggay",
        pHighlight: [[1, 1]],
        fHighlight: [[2, 2]],
      },
      {
        p: "وږمه",
        f: "waGma",
        e: "breeze",
        pHighlight: [[1, 1]],
        fHighlight: [[2, 2]],
      },
      {
        p: "کېږي",
        f: "keGee",
        e: "it happens",
        pHighlight: [[2, 2]],
        fHighlight: [[2, 2]],
      },
    ],
  },
  {
    phoneme: "s",
    possibleLetters: [letters.seen, letters.se, letters.swaad],
    quickExplanation: (
      <>
        s in <strong>s</strong>eason
      </>
    ),
    ipa: {
      letter: "s",
    },
    examples: [
      {
        p: "آسمان",
        f: "aasmaan",
        e: "sky",
        a: "aasmaan",
        pHighlight: [[1, 1]],
        fHighlight: [[2, 2]],
      },
      {
        p: "سور",
        f: "soor",
        e: "red",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 0]],
      },
      {
        p: "اصرار",
        f: "isráar",
        e: "insistence",
        pHighlight: [[1, 1]],
        fHighlight: [[1, 1]],
      },
    ],
  },
  {
    phoneme: "sh",
    possibleLetters: [letters.sheen],
    quickExplanation: (
      <>
        sh in <strong>sh</strong>eet
      </>
    ),
    ipa: {
      letter: "ʃ",
      video: "",
    },
    examples: [
      {
        p: "شین",
        f: "sheen",
        e: "green",
        a: "sheen",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 1]],
      },
    ],
  },
  {
    phoneme: "x",
    a: "x",
    possibleLetters: [letters.xeen],
    quickExplanation: "like kh but more palatal, retroflex sh in southern",
    specialConsonant: true,
    ipa: {
      letter: "x",
      video: "https://www.youtube.com/watch?v=euRbmOchIXE",
    },
    examples: [
      {
        p: "اوښ",
        f: "oox",
        a: "oox",
        e: "camel",
        pHighlight: [[2, 2]],
        fHighlight: [[2, 2]],
      },
      {
        p: "پښتو",
        f: "puxto",
        e: "Pashto",
        pHighlight: [[1, 1]],
        fHighlight: [[2, 2]],
      },
    ],
  },
  {
    phoneme: "'",
    possibleLetters: [letters.ayn],
    quickExplanation: "Arabic pharyngealization or glottal stop", // TODO FIX SPELLING
    canBeIgnored: true,
    ipa: {
      letter: "ˤ, ʔ",
    },
    examples: [
      {
        p: "مراعت",
        f: "mUraa'at",
        e: "applying (a law etc.)",
        pHighlight: [[3, 3]],
        fHighlight: [[5, 5]],
        audio: {
          externalLink: "https://youtu.be/ipg87BfaGDo?t=23",
        },
      },
    ],
  },
  {
    phoneme: "gh",
    a: "gh",
    possibleLetters: [letters.ghayn],
    quickExplanation: "a voiced guttural sound",
    specialConsonant: true,
    ipa: {
      letter: "ɣ",
      video: "https://www.youtube.com/watch?v=MmGjJNGTuIs",
    },
    examples: [
      {
        p: "غرمه",
        f: "gharma",
        e: "noon",
        a: "gharma",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 1]],
      },
    ],
  },
  {
    phoneme: "f",
    possibleLetters: [letters.fe],
    quickExplanation: (
      <>
        f in <strong>f</strong>an
      </>
    ),
    ipa: {
      letter: "f",
    },
    examples: [
      {
        p: "فوجي",
        f: "fojee",
        e: "army person",
        a: "fojee",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 0]],
      },
      {
        p: "افت",
        f: "afat",
        e: "disaster",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 0]],
      },
    ],
  },
  {
    phoneme: "q",
    a: "q",
    possibleLetters: [letters.qaaf],
    quickExplanation: "k but further down the throat",
    ipa: {
      letter: "q",
    },
    examples: [
      {
        p: "قاضي",
        f: "qaazee",
        e: "judge",
        a: "qaazee",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 0]],
      },
    ],
  },
  {
    phoneme: "k",
    possibleLetters: [letters.kaaf],
    quickExplanation: (
      <>
        k in <strong>k</strong>ind
      </>
    ),
    ipa: {
      letter: "k",
    },
    examples: [
      {
        p: "کور",
        f: "kor",
        e: "house",
        a: "kor",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 0]],
      },
    ],
  },
  {
    phoneme: "g",
    possibleLetters: [letters.gaaf],
    quickExplanation: (
      <>
        g in <strong>g</strong>ame
      </>
    ),
    ipa: {
      letter: "g",
    },
    examples: [
      {
        p: "ګل",
        f: "gUl",
        e: "flower",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 0]],
        a: "guul",
      },
      {
        p: "ګور",
        f: "gor",
        e: "grave",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 0]],
      },
    ],
  },
  {
    phoneme: "l",
    a: "l",
    possibleLetters: [letters.laam],
    quickExplanation: "l with back of tongue higher up",
    ipa: {
      letter: "l",
      link: "https://en.wikipedia.org/wiki/Voiced_dental,_alveolar_and_postalveolar_lateral_approximants#Voiced_alveolar_lateral_approximant",
    },
    examples: [
      {
        p: "لیکل",
        f: "leekul",
        e: "to write",
        a: "leekul",
        pHighlight: [
          [0, 0],
          [3, 3],
        ],
        fHighlight: [
          [0, 0],
          [5, 5],
        ],
      },
    ],
  },
  {
    phoneme: "m",
    possibleLetters: [letters.meem],
    quickExplanation: (
      <>
        m in <strong>m</strong>aze
      </>
    ),
    ipa: {
      letter: "m",
    },
    examples: [
      {
        p: "مات",
        f: "maat",
        e: "broken",
        a: "maat",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 0]],
      },
      {
        p: "مور",
        f: "mor",
        e: "mother",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 0]],
      },
    ],
  },
  {
    phoneme: "n",
    possibleLetters: [letters.noon],
    quickExplanation: "n with tongue further up on teeth",
    ipa: {
      letter: "n",
    },
    examples: [
      {
        p: "نايي",
        f: "naayee",
        e: "barber",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 0]],
        a: "naayee",
      },
      {
        p: "نن",
        f: "nun",
        e: "today",
        pHighlight: [
          [0, 0],
          [1, 1],
        ],
        fHighlight: [
          [0, 0],
          [2, 2],
        ],
      },
    ],
  },
  {
    phoneme: "N",
    a: "nn",
    possibleLetters: [letters.Noon],
    quickExplanation: "retroflex n",
    specialConsonant: true,
    ipa: {
      letter: "ɳ",
      link: "https://en.wikipedia.org/wiki/Voiced_retroflex_nasal",
      video: "https://www.youtube.com/watch?v=RKyAPB6Ldgo",
    },
    examples: [
      {
        p: "مڼه",
        f: "maNa",
        e: "apple",
        a: "manna",
        pHighlight: [[1, 1]],
        fHighlight: [[2, 2]],
      },
      {
        p: "پاڼه",
        f: "paaNa",
        e: "leaf",
        a: "manna",
        pHighlight: [[2, 2]],
        fHighlight: [[3, 3]],
      },
    ],
  },
  {
    phoneme: "w",
    a: "w",
    possibleLetters: [letters.waaw],
    quickExplanation: "w or very light v-like sound with both lips",
    ipa: {
      letter: "w, β̞",
      link: "https://en.wikipedia.org/wiki/Voiced_bilabial_fricative",
    },
    examples: [
      {
        p: "وږی",
        f: "wuGay",
        a: "wuggay",
        e: "hungry",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 0]],
      },
      {
        p: "کوې",
        f: "kawe",
        e: "you do",
        pHighlight: [[1, 1]],
        fHighlight: [[2, 2]],
      },
    ],
  },
  {
    phoneme: "y",
    possibleLetters: [letters.naareenaYe],
    endingLetter: letters.klakaYe,
    quickExplanation: (
      <>
        y in <strong>y</strong>es
      </>
    ),
    ipa: {
      letter: "j",
    },
    examples: [
      {
        p: "یاد",
        f: "yaad",
        e: "memory",
        pHighlight: [[0, 0]],
        fHighlight: [[0, 0]],
      },
    ],
  },
  // short-vowels
  {
    phoneme: "a",
    a: "a",
    shortVowel: true,
    diacritic: diacritics.zwar,
    quickExplanation: (
      <>
        short a similar to a in c<strong>a</strong>re
      </>
    ),
    ipa: {
      letter: "a",
    },
    examples: [
      {
        p: "سَړی",
        f: "saRay",
        e: "man",
        a: "sarray",
        pHighlight: [[1, 1]],
        fHighlight: [[1, 1]],
      },
    ],
  },
  {
    phoneme: "i",
    shortVowel: true,
    diacritic: diacritics.zer,
    quickExplanation: (
      <>
        similar to i in b<strong>i</strong>t
      </>
    ),
    ipa: {
      letter: "ɪ",
    },
    examples: [
      {
        p: "اِسلام",
        f: "islaam",
        e: "Islam",
        a: "islaam",
        pHighlight: [[0, 1]],
        fHighlight: [[0, 0]],
      },
    ],
  },
  {
    phoneme: "U",
    a: "uu",
    shortVowel: true,
    diacritic: diacritics.pesh,
    quickExplanation: (
      <>
        short 'oo' sound similar to u in n<strong>u</strong>ke
      </>
    ),
    ipa: {
      letter: "u",
    },
    examples: [
      {
        p: "لُطفاً",
        f: "lUtfan",
        e: "please",
        a: "luutfan",
        pHighlight: [[1, 1]],
        fHighlight: [[1, 1]],
      },
      {
        p: "خدای",
        f: "khUdaay",
        e: "God",
        pHighlight: [],
        fHighlight: [[2, 2]],
      },
    ],
  },
  {
    phoneme: "u",
    shortVowel: true,
    diacritic: diacritics.zwarakay,
    quickExplanation: (
      <>
        shwa sound similar to u in b<strong>u</strong>d
      </>
    ),
    ipa: {
      letter: "ə",
    },
    examples: [
      {
        p: "واده",
        f: "waadu",
        pHighlight: [[3, 3]],
        fHighlight: [[4, 4]],
      },
      {
        p: "پټ",
        f: "puT",
        e: "hidden",
        pHighlight: [],
        fHighlight: [[1, 1]],
      },
    ],
  },
  // vowels
  {
    phoneme: "aa",
    a: "aa",
    possibleLetters: [letters.alif],
    longVowel: true,
    quickExplanation: (
      <>
        similar to long a in f<strong>a</strong>ther
      </>
    ),
    ipa: {
      letter: "ɑ",
    },
    examples: [
      {
        p: "آسمان",
        f: "aasmaan",
        e: "sky",
        a: "aasmaan",
        pHighlight: [
          [0, 0],
          [3, 3],
        ],
        fHighlight: [
          [0, 1],
          [4, 5],
        ],
      },
    ],
  },
  {
    phoneme: "ee",
    a: "ee",
    possibleLetters: [letters.klakaYe],
    longVowel: true,
    fiveYs: true,
    addAlefToStart: true,
    diacritic: diacritics.zer,
    quickExplanation: (
      <>
        ee in b<strong>ee</strong>
      </>
    ),
    ipa: {
      letter: "i",
    },
    examples: [
      {
        p: "لیکل",
        f: "leekul",
        e: "to write",
        a: "leekul",
        pHighlight: [[1, 1]],
        fHighlight: [[1, 2]],
      },
    ],
  },
  {
    phoneme: "o",
    a: "o",
    possibleLetters: [letters.waaw],
    longVowel: true,
    addAlefToStart: true,
    quickExplanation: (
      <>
        similar to o in b<strong>o</strong>ne
      </>
    ),
    ipa: {
      letter: "o",
    },
    examples: [
      {
        p: "پښتو",
        f: "puxto",
        e: "Pashto",
        a: "puxto",
        pHighlight: [[3, 3]],
        fHighlight: [[4, 4]],
      },
    ],
  },
  {
    phoneme: "oo",
    a: "oo",
    possibleLetters: [letters.waaw],
    longVowel: true,
    addAlefToStart: true,
    diacritic: diacritics.pesh,
    quickExplanation: (
      <>
        similar to oo in f<strong>oo</strong>d
      </>
    ),
    ipa: {
      letter: "u",
    },
    examples: [
      {
        p: "کدو",
        f: "kadoo",
        e: "pumpkin",
        a: "kadoo",
        pHighlight: [[2, 2]],
        fHighlight: [[3, 4]],
      },
    ],
  },
  {
    phoneme: "e",
    a: "e",
    possibleLetters: [letters.pastaYe],
    longVowel: true,
    fiveYs: true,
    addAlefToStart: true,
    quickExplanation: <>'ee' sound but with mouth slightly more open</>,
    ipa: {
      letter: "e",
    },
    examples: [
      {
        p: "ښځې",
        f: "xudze",
        e: "women",
        a: "xudze",
        pHighlight: [[2, 2]],
        fHighlight: [[4, 4]],
      },
    ],
  },
  {
    phoneme: "ay",
    a: "ay",
    possibleLetters: [letters.naareenaYe],
    longVowel: true,
    fiveYs: true,
    addAlefToStart: true,
    quickExplanation: (
      <>
        short 'a' sound + y. similar to ay in d<strong>ay</strong>
      </>
    ),
    ipa: {
      letter: "ai",
    },
    examples: [
      {
        p: "سړی",
        f: "saRay",
        e: "man",
        a: "saRay",
        pHighlight: [[2, 2]],
        fHighlight: [[3, 4]],
      },
    ],
  },
  {
    phoneme: "ey",
    a: "ey",
    possibleLetters: [letters.faailiyaYe],
    longVowel: true,
    fiveYs: true,
    onlyOnEnd: true,
    quickExplanation: "‘e’ sound + y",
    ipa: {
      letter: "əi",
    },
    examples: [
      {
        p: "کښېنئ",
        f: "kxeney",
        e: "please sit",
        a: "kxeney",
        pHighlight: [[4, 4]],
        fHighlight: [[4, 6]],
      },
    ],
  },
  {
    phoneme: "uy",
    a: "uy",
    possibleLetters: [letters.xudzeenaYe],
    longVowel: true,
    fiveYs: true,
    quickExplanation: "‘u’ (schwa) sound + y",
    ipa: {
      letter: "əi",
    },
    examples: [
      {
        p: "مرۍ",
        f: "maruy",
        e: "throat",
        a: "maruy",
        pHighlight: [[2, 2]],
        fHighlight: [[4, 5]],
      },
      {
        p: "انجلۍ",
        f: "injuluy",
        e: "girl",
        a: "injuluy",
        pHighlight: [[4, 4]],
        fHighlight: [[5, 6]],
      },
    ],
  },
  // {
  //     phoneme: "ooy",
  //     // TODO DEAL WITH POSSIBLE LETTERS:
  //     compoundVowel: true,
  //     examples: [{
  //         p: "زوی",
  //         f: "zooy",
  //         e: "son",
  //         pHighlight: [[1, 2]],
  //         fHighlight: [[1, 3]],
  //     }],
  // },
  // {
  //     phoneme: "aay",
  //     compoundVowel: true,
  //     examples: [{
  //         p: "څای",
  //         f: "dzaay",
  //         e: "place",
  //         pHighlight: [[1, 2]],
  //         fHighlight: [[2, 4]],
  //     }]
  // },
];

// TODO ooy - aay
