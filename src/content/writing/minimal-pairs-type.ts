const minimalPairsSection = [
  "t and T",
  "d and D",
  "r and R",
  "n and N",
  "a and aa",
  "ay and uy",
  "ay and e",
  "ee and e",
] as const;
export type MinimalPairsSection = (typeof minimalPairsSection)[number];
