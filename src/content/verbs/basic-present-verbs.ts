import type { Types as T } from "@lingdocs/pashto-inflector";
import { wordQuery } from "../../words/words";

export const basicVerbs: T.VerbEntry[] = wordQuery("verbs", [
  "leekul",
  "wahul",
  "skul",
  "kawul",
  "leedul",
  "awredul",
  "khoRul",
]);

export const intransitivePastVerbs: T.VerbEntry[] = wordQuery("verbs", [
  "rasedul",
  "gurdzedul",
  "tuxtedul",
  "ghuGedul",
  "lwedul",
  "raatlúl",
  "zeGedul",
  "kenaastul",
  "alwatul",
  "prewatul",
  "خوځېدل",
]);
