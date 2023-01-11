import { Node, parse } from "sql-parser-cst";
import { Parser, Printer, SupportLanguage } from "prettier";
import { printSql } from "./printSql";

export const languages: SupportLanguage[] = [
  {
    extensions: [".sql"],
    name: "SQL",
    parsers: ["sql-parse"],
  },
];

export const parsers: Record<string, Parser<Node>> = {
  "sql-parse": {
    parse: (text) => parse(text, { dialect: "sqlite", includeRange: true }),
    astFormat: "sql-ast",
    locStart: (node) => node.range?.[0] as number,
    locEnd: (node) => node.range?.[1] as number,
  },
};

export const printers: Record<string, Printer> = {
  "sql-ast": {
    print: printSql as Printer["print"],
  },
};
