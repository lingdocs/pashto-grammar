import type { Types as T } from "@lingdocs/ps-react";
import { randFromArray, sandwiches } from "@lingdocs/ps-react";

export function makeSandwich(np: T.NPSelection): T.APSelection {
  return {
    type: "AP",
    selection: {
      ...randFromArray(sandwiches),
      inside: np,
    },
  };
}
