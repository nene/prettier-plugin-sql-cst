import { Node } from "sql-parser-cst";
import { doc, AstPath, Doc, ParserOptions } from "prettier";

const { join, line, indent } = doc.builders;

export function printSql(
  path: AstPath<Node>,
  options: ParserOptions<Node>,
  print: (path: AstPath<Node> | string) => Doc
): Doc {
  const node = path.getValue();

  switch (node.type) {
    case "program":
      return path.map(print, "statements");
    case "select_stmt":
      return path.map(print, "clauses");
    case "select_clause":
      return [print("selectKw"), indent([line, print("columns")])];
    case "list_expr":
      return join([",", line], path.map(print, "items"));
    case "keyword":
      return node.text;
    case "number_literal":
      return node.text;
    default:
      throw new Error(`Unexpected node type: ${node.type}`);
  }
}
