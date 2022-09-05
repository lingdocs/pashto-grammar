import {
    removeAccents,
    hasAccents,
    Types as T,
    standardizePashto,
    standardizePhonetics,
    flattenLengths,
} from "@lingdocs/pashto-inflector";

export function getPercentageDone(current: number, total: number): number {
    return Math.round(
        (current / (total + 1)) * 100
    );
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
    return input === (hasAccents(input) ? answer : removeAccents(answer));
}

export function comparePs(input: string, answer: T.SingleOrLengthOpts<T.PsString | T.PsString[]>): boolean {
    if ("long" in answer) {
        return comparePs(input, flattenLengths(answer))
    }
    if (Array.isArray(answer)) {
        return answer.some(a => comparePs(input, a));
    }
    const stand = standardizePhonetics(
        standardizePashto(input)
    ).trim();
    return stand === answer.p || compareF(stand, answer.f);
}