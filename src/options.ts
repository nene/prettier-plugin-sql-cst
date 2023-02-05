import { ParserOptions, SupportOptions } from "prettier";
import { Node } from "sql-parser-cst";

export interface SqlPluginOptions {
  sqlKeywordCase: "preserve" | "upper" | "lower";
  sqlAliasAs: "preserve" | "always" | "never";
}

// Prettier builtin options + options of this plugin
export type AllPrettierOptions<T = Node> = ParserOptions<T> & SqlPluginOptions;

export const options: SupportOptions = {
  sqlKeywordCase: {
    type: "choice",
    category: "SQL",
    since: "0.1.0",
    default: "upper",
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
    default: "always",
    description: "Enforce or forbid use of AS keyword in aliases",
    choices: [
      { value: "preserve", description: "keeps existing style" },
      { value: "always", description: "always includes AS keyword" },
      { value: "never", description: "never include AS keyword" },
    ],
  },
};
