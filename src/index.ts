import { DialectName, Node, parse } from "sql-parser-cst";
import { Parser, Printer, SupportLanguage } from "prettier";
import { printSql } from "./printSql";
import { printComment } from "./printComment";
import { embedJson } from "./embedJson";
import { isNode } from "./utils";
import { transformCst } from "./transform/transformCst";
import { AllPrettierOptions } from "./options";

export { options } from "./options";

export const languages: SupportLanguage[] = [
  {
    extensions: [".sql", ".sqlite"],
    name: "SQLite SQL",
    parsers: ["sqlite"],
  },
  {
    extensions: [".bigquery"],
    name: "BigQuery SQL",
    parsers: ["bigquery"],
  },
];

const createParser = (dialect: DialectName): Parser<Node> => ({
  parse: (text, options) =>
    transformCst(
      parse(text, {
        dialect,
        includeRange: true,
        includeComments: true,
        filename: options.filepath,
        paramTypes: (options as AllPrettierOptions<Node>).sqlParamTypes,
      }),
      text
    ),
  astFormat: "sql-cst",
  locStart: (node) => node.range?.[0] as number,
  locEnd: (node) => node.range?.[1] as number,
});

export const parsers: Record<string, Parser<Node>> = {
  sqlite: createParser("sqlite"),
  bigquery: createParser("bigquery"),
};

export const printers: Record<string, Printer> = {
  "sql-cst": {
    print: printSql as Printer["print"],
    embed: embedJson,
    printComment: printComment,
    canAttachComment: isNode,
    isBlockComment: (node) => node.type === "block_comment",
  },
};
