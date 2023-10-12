import { ParserOptions, SupportOptions } from "prettier";
import { Node, ParserOptions as CstParserOptions } from "sql-parser-cst";

export interface SqlPluginOptions {
  sqlKeywordCase: "preserve" | "upper" | "lower";
  sqlParamTypes: NonNullable<CstParserOptions["paramTypes"]>;
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
      { value: "upper", description: "forces all keywords to uppercase", since: "0.1.0", },
      { value: "lower", description: "forces all keywords to lowercase", since: "0.1.0", },
    ],
  },
  sqlParamTypes: {
    type: "string",
    array: true,
    category: "SQL",
    default: [{ value: [] }],
    description: "Syntax for bound parameters",
    // Since 0.7.0
    // Possible values in array: "?" | "?nr" | ":name" | "$name" | "@name"
  },
};
