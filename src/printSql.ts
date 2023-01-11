import { Node, Whitespace } from "sql-parser-cst";
import { doc, AstPath, Doc, ParserOptions } from "prettier";

const { join, line, softline, indent, group } = doc.builders;

type PrintFn = (path: AstPath<Node> | string) => Doc;

export function printSql(
  path: AstPath<Node>,
  options: ParserOptions<Node>,
  print: PrintFn
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
  return ws.map((c) => [c.text, line]);
}

function printNode(
  path: AstPath<Node>,
  options: ParserOptions<Node>,
  print: PrintFn
) {
  const node = path.getValue();
  switch (node.type) {
    case "program":
      return path.map(print, "statements");
    case "select_stmt":
      return path.map(print, "clauses");
    case "select_clause":
      return group([print("selectKw"), indent([line, print("columns")])]);
    case "list_expr":
      return join([",", line], path.map(print, "items"));
    case "paren_expr":
      const parent = path.getParentNode();
      if (parent?.type === "func_call") {
        return ["(", indent([softline, print("expr")]), softline, ")"];
      } else {
        return ["(", print("expr"), ")"];
      }
    case "func_call":
      return group([print("name"), print("args")]);
    case "func_args":
      return print("args");
    case "keyword":
      return node.text;
    case "number_literal":
      return node.text;
    case "identifier":
      return node.text;
    default:
      throw new Error(`Unexpected node type: ${node.type}`);
  }
}
