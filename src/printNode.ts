import { Node } from "sql-parser-cst";
import { AstPath, Doc, ParserOptions } from "prettier";
import { join, line, hardline, softline, indent, group } from "./print_utils";
import { PrintFn } from "./PrintFn";
import { isDefined, isString } from "./utils";

type NodeByType<T> = Extract<Node, { type: T }>;

type ToDocFn<TNode> = (
  path: AstPath<TNode>,
  print: PrintFn<TNode>,
  options: ParserOptions<TNode>
) => Doc;

type CstToDocMap = {
  [K in Node["type"]]: ToDocFn<NodeByType<K>>;
};

const printLines = <T>(
  path: AstPath<T>,
  childrenAttr: any,
  print: PrintFn<T>
): Doc => {
  return path.map((childPath, i, all) => {
    const node: Node = childPath.getValue() as any;
    if (i === 0) {
      return print(childPath as any);
    } else if (i < all.length - 1 || node.type !== "empty") {
      return [";", hardline, print(childPath as any)];
    } else {
      return [";", print(childPath as any)];
    }
  }, childrenAttr);
};

const transformMap: Partial<CstToDocMap> = {
  program: (path, print) => printLines(path, "statements", print),
  empty: () => [],
  select_stmt: (path, print) => group(join(line, path.map(print, "clauses"))),
  select_clause: (path, print) =>
    group([print("selectKw"), indent([line, print("columns")])]),
  from_clause: (path, print) => [print("fromKw"), " ", print("expr")],
  where_clause: (path, print) => [print("whereKw"), " ", print("expr")],
  order_by_clause: (path, print) =>
    group([
      join(" ", path.map(print, "orderByKw")),
      indent([line, print("specifications")]),
    ]),
  sort_specification: (path, print) =>
    join(
      " ",
      [
        print("expr"),
        path.getValue().orderKw ? print("orderKw") : undefined,
      ].filter(isDefined)
    ),
  alias: (path, print) =>
    join(
      " ",
      [
        print("expr"),
        path.getValue().asKw ? print("asKw") : undefined,
        print("alias"),
      ].filter(isDefined)
    ),
  list_expr: (path, print) => join([",", line], path.map(print, "items")),
  paren_expr: (path, print) => {
    const parent = path.getParentNode() as Node;
    if (parent?.type === "func_call") {
      return ["(", indent([softline, print("expr")]), softline, ")"];
    } else {
      return ["(", print("expr"), ")"];
    }
  },
  binary_expr: (path, print) => {
    const op = path.getValue().operator;
    return join(" ", [
      print("left"),
      isString(op) ? op : print("operator"),
      print("right"),
    ]);
  },
  func_call: (path, print) => group([print("name"), print("args")]),
  func_args: (path, print) => print("args"),
  keyword: (path) => path.getValue().text,
  number_literal: (path) => path.getValue().text,
  boolean_literal: (path) => path.getValue().text,
  identifier: (path) => path.getValue().text,
  all_columns: () => "*",
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
