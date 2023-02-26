import { DialectName, Node, parse, Whitespace } from "sql-parser-cst";
import { AstPath, Parser, Printer, SupportLanguage } from "prettier";
import { printSql } from "./printSql";
import { embed } from "./embed";
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
  parse: (text, parsers, options) =>
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
    embed: embed,
    printComment: (path: AstPath<Whitespace>) => {
      const node = path.getValue();
      if (node.type === "line_comment") {
        if (!/^--([ \t]|$)/.test(node.text)) {
          return node.text.replace(/^--/, "-- ");
        }
      }
      return node.text;
    },
    canAttachComment: isNode,
    isBlockComment: (node) => node.type === "block_comment",
  },
};
