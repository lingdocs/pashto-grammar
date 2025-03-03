import { Types as T, randFromArray, sandwiches } from "@lingdocs/ps-react";

export function makeSandwich(np: T.NPSelection): T.APSelection {
  return {
    type: "AP",
    selection: {
      ...randFromArray(sandwiches),
      inside: np,
    },
  };
}
