import Markdown from "markdown-to-jsx";
import type { Types as T } from "@lingdocs/ps-react";
import type { JSX } from "react";

type PsEnhanced = T.PsString & {
  e?: string,
  sub?: string,
}

type WMarkdown = {
  p: JSX.Element | string,
  f: JSX.Element | string,
  e?: JSX.Element | string,
  sub?: JSX.Element | string,
}

export default function psmd(input: PsEnhanced | PsEnhanced[]): WMarkdown | WMarkdown[] {
  if (Array.isArray(input)) {
    return input.flatMap(psmd);
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
