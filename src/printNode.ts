import { Node } from "sql-parser-cst";
import { AstPath, Doc, ParserOptions } from "prettier";
import { PrintFn } from "./PrintFn";
import { isArray, isString } from "./utils";
import { NodeByType, ToDocFn } from "./CstToDocMap";
import { transformMap } from "./syntax";

export function printNode(
  path: AstPath<Node>,
  options: ParserOptions<Node>,
  print: PrintFn<Node>
): Doc {
  const node = path.getValue();

  if (isArray(node)) {
    return path.map(print);
  }
  if (isString(node)) {
    return node;
  }

  const fn = transformMap[node.type] as ToDocFn<
    NodeByType<(typeof node)["type"], Node>
  >;

  if (!fn) {
    if (!node.type) {
      throw new Error(`No type field on node: ${JSON.stringify(node)}`);
    }
    throw new Error(`Unexpected node type: ${node.type}`);
  }

  return fn(print, path, options);
}
