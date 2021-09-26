import React, { ReactNode } from "react";
import { ViewOptions } from "./PhoneticsViewer";

const views: {
  value: ViewOptions;
  label: string;
  notes?: ReactNode;
}[] = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "shortVowel",
    label: "Short Vowels",
    notes: (
      <div>
        <p>
          These short vowels are <strong>not written</strong> in the Pashto
          script, except when:
        </p>
        <ul>
          <li>at the beginning of a word, they are written with an ا</li>
          <li>at the end of a word, they are written with an ـه</li>
        </ul>
        <p>Diacritics can be (optionally) added to show these short vowels.</p>
      </div>
    ),
  },
  {
    value: "longVowel",
    label: "Long Vowels",
    notes: (
      <div>
        <p>
          Long vowels are <strong>always written</strong> in Pashto script. When
          long vowels come at the beginning of a word, they are prefixed with a letter alef (ا).
        </p>
        <p>for example:</p>
        <ul>
          <li>
            <strong>o</strong>sedul - <strong>او</strong>سېدل
          </li>
          <li>
            <strong>ee</strong>stul - <strong>ای</strong>ستل
          </li>
        </ul>
        <p>
          Note: When ey - ی or ee - ي are written in the middle of a word, both appear as ـیـ.
          To differentiate ee - ي from ey - ی you can (optionally) add a ◌ِ diacritic. (eg. شِین - sheen)
        </p>
      </div>
    ),
  },
  {
    value: "specialConsonant",
    label: "Tricky Consonants",
  },
  {
    value: "fiveYs",
    label: "The Five ی's",
  },
];

export default views;
