import { ParserOptions, SupportOptions } from "prettier";
import { Node, ParserOptions as CstParserOptions } from "sql-parser-cst";

export interface SqlPluginOptions {
  sqlKeywordCase: "preserve" | "upper" | "lower";
  sqlLiteralCase: "preserve" | "upper" | "lower";
  sqlTypeCase: "preserve" | "upper" | "lower";
  sqlIdentifierCase: "preserve" | "upper" | "lower";
  sqlFunctionCase: "preserve" | "upper" | "lower";
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
  sqlLiteralCase: {
    type: "choice",
    category: "SQL",
    default: "upper",
    description:
      "Enforces upper/lower case for SQL literals (TRUE, FALSE, NULL)",
    choices: [
      {
        value: "preserve",
        description: "preserves the existing case",
        since: "0.14.0",
      },
      {
        value: "upper",
        description: "forces all literals to uppercase",
        since: "0.14.0",
      },
      {
        value: "lower",
        description: "forces all literals to lowercase",
        since: "0.14.0",
      },
    ],
  },
  sqlTypeCase: {
    type: "choice",
    category: "SQL",
    default: "upper",
    description: "Enforces upper/lower case for SQL types",
    choices: [
      {
        value: "preserve",
        description: "preserves the existing case",
        since: "0.17.0",
      },
      {
        value: "upper",
        description: "forces all type names to uppercase",
        since: "0.17.0",
      },
      {
        value: "lower",
        description: "forces all type names to lowercase",
        since: "0.17.0",
      },
    ],
  },
  sqlIdentifierCase: {
    type: "choice",
    category: "SQL",
    default: "preserve",
    description: "Enforces upper/lower case for unquoted SQL identifiers",
    choices: [
      {
        value: "preserve",
        description: "preserves the existing case",
        since: "0.17.0",
      },
      {
        value: "upper",
        description: "forces all unquoted identifier names to uppercase",
        since: "0.17.0",
      },
      {
        value: "lower",
        description: "forces all unquoted identifier names to lowercase",
        since: "0.17.0",
      },
    ],
  },
  sqlFunctionCase: {
    type: "choice",
    category: "SQL",
    default: "preserve",
    description: "Enforces upper/lower case for SQL function names",
    choices: [
      {
        value: "preserve",
        description: "preserves the existing case",
        since: "0.17.0",
      },
      {
        value: "upper",
        description: "forces all unquoted function names to uppercase",
        since: "0.17.0",
      },
      {
        value: "lower",
        description: "forces all unquoted function names to lowercase",
        since: "0.17.0",
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
