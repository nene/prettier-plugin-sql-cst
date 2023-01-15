import { Node } from "sql-parser-cst";
import { AstPath, ParserOptions } from "prettier";
import { PrintFn } from "./PrintFn";
import { isArray, isString } from "./utils";
import { CstToDocMap, NodeByType, ToDocFn } from "./CstToDocMap";
import { aliasMap } from "./syntax/alias";
import { exprMap } from "./syntax/expr";
import { programMap } from "./syntax/program";
import { selectMap } from "./syntax/select";

const transformMap: Partial<CstToDocMap<Node>> = {
  ...aliasMap,
  ...exprMap,
  ...programMap,
  ...selectMap,
  empty: () => [],
  keyword: (print, path) => path.getValue().text,
  all_columns: () => "*",
};

export function printNode(
  path: AstPath<Node>,
  options: ParserOptions<Node>,
  print: PrintFn<Node>
) {
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
