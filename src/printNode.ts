import { Node } from "sql-parser-cst";
import { AstPath, Doc, ParserOptions } from "prettier";
import { join, line, softline, indent, group } from "./print_utils";
import { PrintFn } from "./PrintFn";

type NodeByType<T> = Extract<Node, { type: T }>;

type ToDocFn<TNode> = (
  path: AstPath<TNode>,
  print: PrintFn<TNode>,
  options: ParserOptions<TNode>
) => Doc;

type CstToDocMap = {
  [K in Node["type"]]: ToDocFn<NodeByType<K>>;
};

const transformMap: Partial<CstToDocMap> = {
  program: (path, print) => path.map(print, "statements"),
  select_stmt: (path, print) => path.map(print, "clauses"),
  select_clause: (path, print) =>
    group([print("selectKw"), indent([line, print("columns")])]),
  list_expr: (path, print) => join([",", line], path.map(print, "items")),
  paren_expr: (path, print) => {
    const parent = path.getParentNode() as Node;
    if (parent?.type === "func_call") {
      return ["(", indent([softline, print("expr")]), softline, ")"];
    } else {
      return ["(", print("expr"), ")"];
    }
  },
  func_call: (path, print) => group([print("name"), print("args")]),
  func_args: (path, print) => print("args"),
  keyword: (path) => path.getValue().text,
  number_literal: (path) => path.getValue().text,
  identifier: (path) => path.getValue().text,
};

export function printNode(
  path: AstPath<Node>,
  options: ParserOptions<Node>,
  print: PrintFn<Node>
) {
  const node = path.getValue();
  const fn = transformMap[node.type] as ToDocFn<
    NodeByType<(typeof node)["type"]>
  >;

  if (!fn) {
    if (!node.type) {
      throw new Error(`No type field on node: ${JSON.stringify(node)}`);
    }
    throw new Error(`Unexpected node type: ${node.type}`);
  }

  return fn(path, print, options);
}
