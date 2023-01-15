import { Node } from "sql-parser-cst";
import { AstPath, Doc, ParserOptions } from "prettier";
import { printNode } from "./printNode";
import { PrintFn } from "./PrintFn";

export function printSql(
  path: AstPath<Node>,
  options: ParserOptions<Node>,
  print: PrintFn<Node>
): Doc {
  return printNode(path, options, print);
}
