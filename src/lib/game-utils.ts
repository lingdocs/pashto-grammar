import {
  removeAccents,
  hasAccents,
  Types as T,
  standardizePashto,
  standardizePhonetics,
  flattenLengths,
} from "@lingdocs/ps-react";
import { removeAShort } from "./misc-helpers";

export function getPercentageDone(current: number, total: number): number {
  return Math.round((current / (total + 1)) * 100);
}

/**
 * Says if an input written in phonetics by the user is correct/the same as a given answer
 *
 * The user is allowed to leave out the accents, but if they include them they must be the same as the answer
 *
 * @param input - the answer given by the user in phonetics
 * @param answer - the correct answer in phonetics
 */
export function compareF(input: string, answer: string): boolean {
  const inp = removeAShort(input);
  const ans = removeAShort(answer);
  return inp === (hasAccents(inp) ? ans : removeAccents(ans));
}

export function comparePs(
  inputRaw: string,
  answer: T.SingleOrLengthOpts<T.PsString[]>
): boolean {
  function cleanSpaces(s: string): string {
    return s.replace(/\s+/g, " ");
  }
  const input = cleanSpaces(inputRaw);
  if ("long" in answer) {
    return comparePs(input, flattenLengths(answer));
  }
  return answer.some((a) => {
    const stand = standardizePhonetics(standardizePashto(input)).trim();
    return stand === cleanSpaces(a.p) || compareF(stand, cleanSpaces(a.f));
  });
}
