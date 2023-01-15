import { Node, parse } from "sql-parser-cst";
import { Parser, Printer, SupportLanguage } from "prettier";
import { printSql } from "./printSql";
import { isString } from "./utils";

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
      addComments(
        text,
        parse(text, {
          dialect: "sqlite",
          includeRange: true,
        })
      ),
    astFormat: "sql-cst",
    locStart: (node) => node.range?.[0] as number,
    locEnd: (node) => node.range?.[1] as number,
  },
};

const addComments = (
  text: string,
  ast: Node
): Node & { comments: Comment[] } => {
  return {
    ...ast,
    comments: detectComments(text),
  };
};

type Comment = { type: "comment"; text: string; range: [number, number] };

const detectComments = (text: string): Comment[] => {
  const comments: Comment[] = [];
  let index = 0;
  while (text.length > 0) {
    let m = text.match(/^\/\*.*?\*\/|^--.*$/);
    if (m) {
      const len = m[0].length;
      comments.push({
        type: "comment",
        text: m[0],
        range: [index, index + len],
      });
      text = text.slice(len);
      index += len;
    } else {
      text = text.slice(1);
      index++;
    }
  }
  return comments;
};

export const printers: Record<string, Printer> = {
  "sql-cst": {
    print: printSql as Printer["print"],
    printComment: (path) => {
      return path.getValue().text;
    },
    canAttachComment: (node) => {
      return isString(node?.type) && node.type !== "comment";
    },
  },
};
