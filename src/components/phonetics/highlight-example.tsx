import type { ReactNode } from "react";

export default function highlightExample(
  text: string,
  highlight: number[][]
): ReactNode {
  if (!highlight.length) {
    return text;
  }
  let index = 0;
  // @ts-ignore
  const pText = highlight.reduce((acc, curr, i): ReactNode => {
    const isLastElement = i === highlight.length - 1;
    const section = [
      ...acc,
      curr[0] > 0 ? text.slice(index, curr[0]) : "",
      <strong>{text.slice(curr[0], curr[1] + 1)}</strong>,
      isLastElement ? text.slice(curr[1] + 1) : "",
    ];
    index = curr[1] + 1;
    return section;
  }, []);
  return pText;
}
