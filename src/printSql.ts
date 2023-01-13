import { Node, Whitespace } from "sql-parser-cst";
import { AstPath, Doc, ParserOptions } from "prettier";
import { printNode } from "./printNode";
import { line, lineSuffix } from "./print_utils";
import { PrintFn } from "./PrintFn";

export function printSql(
  path: AstPath<Node>,
  options: ParserOptions<Node>,
  print: PrintFn<Node>
): Doc {
  return withComments(path, printNode(path, options, print));
}

function withComments(path: AstPath<Node>, doc: Doc): Doc {
  const node = path.getValue();
  if (node.leading?.length || node.trailing?.length) {
    return [
      ...printComments(node.leading),
      doc,
      ...printComments(node.trailing),
    ];
  }
  return doc;
}

function printComments(ws: Whitespace[] = []): Doc[] {
  return ws.map((c) => {
    if (c.type === "line_comment") {
      return [lineSuffix([" ", c.text])];
    } else {
      return [c.text, line];
    }
  });
}
