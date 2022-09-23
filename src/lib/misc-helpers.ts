/**
 * Removes ă and replaces with a
 */
export function removeAShort(s: string): string {
    return s.replace(/ă/g, "a");
}