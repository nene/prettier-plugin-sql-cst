import { Node, parse } from "sql-parser-cst";
import { Parser, ParserOptions, Printer, SupportLanguage } from "prettier";
import { printSql } from "./printSql";
import { isNode } from "./utils";
import { SqlPluginOptions } from "./options";
import { transformCst } from "./transform/transformCst";

export { options } from "./options";

export const languages: SupportLanguage[] = [
  {
    extensions: [".sql"],
    name: "SQL",
    parsers: ["sql-parser-cst"],
  },
];

export const parsers: Record<string, Parser<Node>> = {
  "sql-parser-cst": {
    parse: (text, parsers, options) =>
      transformCst(
        parse(text, {
          dialect: "sqlite",
          includeRange: true,
          includeComments: true,
          filename: options.filepath,
        }),
        options as ParserOptions<Node> & SqlPluginOptions
      ),
    astFormat: "sql-cst",
    locStart: (node) => node.range?.[0] as number,
    locEnd: (node) => node.range?.[1] as number,
  },
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
