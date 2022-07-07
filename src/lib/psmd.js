import Markdown from "markdown-to-jsx";

export default function psmd(input) {
    if (Array.isArray(input)) {
        return input.map(psmd);
    }
    return {
        ...input,
        p: <Markdown>{input.p}</Markdown>,
        f: <Markdown>{input.f}</Markdown>,
        ...input.e ? {
            e: <Markdown>{input.e}</Markdown>,
        } : {},
        ...input.sub ? {
            sub: <Markdown>{input.sub}</Markdown>,
        } : {},
    };
}