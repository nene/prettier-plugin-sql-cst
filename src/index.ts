import { Node, parse } from "sql-parser-cst";
import {
  doc,
  AstPath,
  Doc,
  Parser,
  ParserOptions,
  SupportLanguage,
} from "prettier";

const { join, line, indent } = doc.builders;

export const languages: Partial<SupportLanguage>[] = [
  {
    extensions: [".sql"],
    name: "SQL",
    parsers: ["sql-parse"],
  },
];

export const parsers: Record<string, Parser> = {
  "sql-parse": {
    parse: (text) => parse(text, { dialect: "sqlite", includeRange: true }),
    astFormat: "sql-ast",
    locStart: (node) => node.range?.[0],
    locEnd: (node) => node.range?.[1],
  },
};

function printSql(
  path: AstPath<Node>,
  options: ParserOptions<Node>,
  print: (path: AstPath<Node> | string) => Doc
) {
  const node = path.getValue();

  switch (node.type) {
    case "program":
      return path.map(print, "statements");
    case "select_stmt":
      return path.map(print, "clauses");
    case "select_clause":
      return [
        print("selectKw"),
        indent([line, join([",", line], print("columns") as Doc[])]),
      ];
    case "list_expr":
      return path.map(print, "items");
    case "keyword":
      return node.text;
    case "number_literal":
      return node.text;
    default:
      throw new Error(`Unexpected node type: ${node.type}`);
  }
}

export const printers = {
  "sql-ast": {
    print: printSql,
  },
};
