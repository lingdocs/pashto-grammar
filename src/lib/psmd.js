import React from "react";
import Markdown from "markdown-to-jsx";

export default function mdps(input) {
    if (Array.isArray(input)) {
        return input.map(mdps);
    }
    return {
        ...input,
        p: <Markdown>{input.p}</Markdown>,
        f: <Markdown>{input.f}</Markdown>,
        ...input.e ? {
            e: <Markdown>{input.e}</Markdown>,
        } : {},
    };
}