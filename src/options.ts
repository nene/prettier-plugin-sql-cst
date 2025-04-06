import { ParserOptions, SupportOptions } from "prettier";
import { Node, ParserOptions as CstParserOptions } from "sql-parser-cst";

export interface SqlPluginOptions {
  sqlKeywordCase: "preserve" | "upper" | "lower";
  sqlParamTypes: NonNullable<CstParserOptions["paramTypes"]>;
  sqlCanonicalSyntax: boolean;
  sqlFinalSemicolon: boolean;
  sqlAcceptUnsupportedGrammar: boolean;
}

// Prettier builtin options + options of this plugin
export type AllPrettierOptions<T = Node> = ParserOptions<T> & SqlPluginOptions;

export const options: SupportOptions = {
  sqlKeywordCase: {
    type: "choice",
    category: "SQL",
    default: "upper",
    description: "Enforces upper/lower case for SQL keywords",
    choices: [
      {
        value: "preserve",
        description: "preserves the existing case",
        since: "0.1.0",
      },
      {
        value: "upper",
        description: "forces all keywords to uppercase",
        since: "0.1.0",
      },
      {
        value: "lower",
        description: "forces all keywords to lowercase",
        since: "0.1.0",
      },
    ],
  },
  sqlParamTypes: {
    type: "string",
    array: true,
    category: "SQL",
    default: [{ value: [] }],
    description: "Syntax for bound parameters",
    // Since 0.7.0
    // Possible values in array: "?" | "?nr" | "$nr" | ":name" | "$name" | "@name"
  },
  sqlCanonicalSyntax: {
    type: "boolean",
    category: "SQL",
    default: true,
    description:
      "Enforces one true style of SQL syntax (adds and removes keywords)",
    // Since 0.11.0
  },
  sqlFinalSemicolon: {
    type: "boolean",
    category: "SQL",
    default: true,
    description: "Enforces a semicolon at the end of last SQL statement",
    // Since 0.13.0
  },
  sqlAcceptUnsupportedGrammar: {
    type: "boolean",
    category: "SQL",
    default: false,
    description:
      "Skips formatting unsupported SQL statements instead of exiting with an error",
    // Since 0.12.0
  },
};
