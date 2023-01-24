import { SupportOptions } from "prettier";

export interface SqlPluginOptions {
  sqlKeywordCase: "preserve" | "upper" | "lower";
  sqlAliasAs: "preserve" | "always" | "never";
}

export const options: SupportOptions = {
  sqlKeywordCase: {
    type: "choice",
    category: "SQL",
    since: "0.1.0",
    default: "preserve",
    description: "Enforces upper/lower case for SQL keywords",
    choices: [
      {
        value: "preserve",
        description: "preserves the existing case",
      },
      { value: "upper", description: "forces all keywords to uppercase" },
      { value: "lower", description: "forces all keywords to lowercase" },
    ],
  },
  sqlAliasAs: {
    type: "choice",
    category: "SQL",
    since: "0.1.1",
    default: "preserve",
    description: "Enforce or forbid use of AS keyword in aliases",
    choices: [
      { value: "preserve", description: "keeps existing style" },
      { value: "always", description: "always includes AS keyword" },
      { value: "never", description: "never include AS keyword" },
    ],
  },
};
