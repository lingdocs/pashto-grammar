import type { Types as T } from "@lingdocs/pashto-inflector";
import { randFromArray, sandwiches } from "@lingdocs/pashto-inflector";

export function makeSandwich(np: T.NPSelection): T.APSelection {
  return {
    type: "AP",
    selection: {
      ...randFromArray(sandwiches),
      inside: np,
    },
  };
}
