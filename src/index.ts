import { Node, parse, Program, Whitespace } from "sql-parser-cst";
import { Parser, Printer, SupportLanguage } from "prettier";
import { printSql } from "./printSql";
import { isNode } from "./utils";
import { visitAllNodes } from "./visitAllNodes";

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

const moveCommentsToRoot = (
  cst: Program
): Program & { comments: Whitespace[] } => {
  return {
    ...cst,
    comments: extractComments(cst),
  };
};

const extractComments = (cst: Program): Whitespace[] => {
  const comments: Whitespace[] = [];
  visitAllNodes(cst, (node) => {
    comments.push(...(node.leading || []), ...(node.trailing || []));
    delete node.leading;
    delete node.trailing;
  });
  return comments;
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
