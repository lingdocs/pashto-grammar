export function firstVariation(s: string): string {
    return s.split(/[,|;]/)[0].trim();
}