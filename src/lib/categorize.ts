import {
  isNoun,
  isPattern1Word,
  isPattern2Word,
  isPattern3Word,
  isPattern4Word,
  isPattern5Word,
  isPattern6FemNoun,
} from "./type-predicates";

/**
 * sorts a given array of on type into a typed object of arrays of subtypes, based on predicates
 * each item will only fall into one category (the first predicate it matches).
 * 
 * Items that don't match any predicate are discarded
 * 
 * types inforced, but it is UP TO THE USER to inforce that the type predicates do indeed determine
 * that a given item belongs in the typed arrays in X
 * 
 * for example:
 * 
 * ```ts
 * categorize<number, {
 *   small: number[], // these could also be subtypes of number
 *   big: number[],
 * }>(
 *   [2,3,11],
 *   {
 *     small: (x: number) => x < 10,
 *     big: (x: nuber) => x >= 10,
 *   },
 * );
 * ```
 * 
 * yields
 * 
 * ```ts
 * { small: [2, 3], big: [11] }
 * ```
 * 
 * @param arr 
 * @param preds 
 * @returns 
 */
export function categorize<I, X extends Record<string, I[]>>(
  arr: I[],
  preds: Record<keyof X, ((item: I) => boolean) | "leftovers">
): X {
  // 1. make the object to be returned;
  const o: X = Object.keys(preds).reduce((all, curr) => ({
    ...all,
    [curr]: [],
  }), {}) as X;

  const lk = Object.entries(preds).find(([key, entry]) => entry === "leftovers");
  const leftoverKey = lk && lk[0];
  // 2. Fill the object with the items that fit
  // go through each item in the array and add it to the category based on
  // the first predicate it matches
  arr.forEach((item) => {
    for (const p of Object.keys(preds)) {
      // @ts-ignore
      if ((preds[p] !== "leftovers") && preds[p](item)) {
        o[p].push(item);
        return;
      }
    }
    // doesn't fit a predicate, add it to the leftovers
    if (leftoverKey) {
      o[leftoverKey].push(item);
    }
  });

  // 3. return the object of categorized items
  return o;
}

export function intoPatterns(words: (Noun | Adjective)[]): {
  "pattern1": Pattern1Word[],
  "pattern2": Pattern2Word[],
  "pattern3": Pattern3Word[],
  "pattern4": Pattern4Word[],
  "pattern5": Pattern5Word[],
  "non-inflecting": NonInflecting[],
  "pattern6fem": Pattern6FemNoun[],
} {
  return categorize<(Noun | Adjective), {
    "pattern1": Pattern1Word[],
    "pattern2": Pattern2Word[],
    "pattern3": Pattern3Word[],
    "pattern4": Pattern4Word[],
    "pattern5": Pattern5Word[],
    "non-inflecting": NonInflecting[],
    "pattern6fem": Pattern6FemNoun[],
  }>(
    words,
    {
      "pattern1": isPattern1Word,
      "pattern2": isPattern2Word,
      "pattern3": isPattern3Word,
      "pattern4": isPattern4Word,
      "pattern5": isPattern5Word,
      "pattern6fem": (n) => (isNoun(n) && isPattern6FemNoun(n)),
      "non-inflecting": "leftovers",
    },
  );
}