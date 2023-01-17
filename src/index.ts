import { Node, parse } from "sql-parser-cst";
import { Parser, Printer, SupportLanguage, SupportOptions } from "prettier";
import { printSql } from "./printSql";
import { isNode } from "./utils";
import { moveCommentsToRoot } from "./comments";

export const languages: SupportLanguage[] = [
  {
    extensions: [".sql"],
    name: "SQL",
    parsers: ["sql-parser-cst"],
  },
];

export const parsers: Record<string, Parser<Node>> = {
  "sql-parser-cst": {
    parse: (text) =>
      moveCommentsToRoot(
        parse(text, {
          dialect: "sqlite",
          includeRange: true,
          preserveComments: true,
        })
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
  },
};

export const options: SupportOptions = {
  sqlKeywordCase: {
    type: "choice",
    category: "SQL",
    since: "0.0.0",
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
};
