import { DialectName, Node, parse } from "sql-parser-cst";
import { Parser, Printer, SupportLanguage } from "prettier";
import { printSql } from "./printSql";
import { isNode } from "./utils";
import { AllPrettierOptions } from "./options";
import { transformCst } from "./transform/transformCst";

export { options } from "./options";

export const languages: SupportLanguage[] = [
  {
    extensions: [".sql", ".sqlite"],
    name: "SQLite SQL",
    parsers: ["sql-parser-cst-sqlite"],
  },
  {
    extensions: [".bigquery"],
    name: "BigQuery SQL",
    parsers: ["sql-parser-cst-bigquery"],
  },
];

const createParser = (dialect: DialectName): Parser<Node> => ({
  parse: (text, parsers, options) =>
    transformCst(
      parse(text, {
        dialect,
        includeRange: true,
        includeComments: true,
        filename: options.filepath,
      }),
      options as AllPrettierOptions
    ),
  astFormat: "sql-cst",
  locStart: (node) => node.range?.[0] as number,
  locEnd: (node) => node.range?.[1] as number,
});

export const parsers: Record<string, Parser<Node>> = {
  "sql-parser-cst-sqlite": createParser("sqlite"),
  "sql-parser-cst-bigquery": createParser("bigquery"),
};

export const printers: Record<string, Printer> = {
  "sql-cst": {
    print: printSql as Printer["print"],
    printComment: (path) => {
      return path.getValue().text;
    },
    canAttachComment: isNode,
    isBlockComment: (node) => node.type === "block_comment",
  },
};
