import { Node } from "sql-parser-cst";
import { AstPath, Doc, ParserOptions } from "prettier";
import { join, line, hardline, softline, indent, group } from "./print_utils";
import { PrintFn } from "./PrintFn";
import { isArray, isDefined, isString } from "./utils";

type NodeByType<T> = Extract<Node, { type: T }>;

type ToDocFn<TNode> = (
  path: AstPath<TNode>,
  print: PrintFn<TNode>,
  options: ParserOptions<TNode>
) => Doc;

type CstToDocMap = {
  [K in Node["type"]]: ToDocFn<NodeByType<K>>;
};

const printLineWith =
  <T extends Node>(print: (x: AstPath<T>) => Doc) =>
  (childPath: AstPath<T>, i: number, all: T[]): Doc => {
    const node = childPath.getValue();
    if (i === 0) {
      return print(childPath);
    } else if (i < all.length - 1 || node.type !== "empty") {
      return [";", hardline, print(childPath)];
    } else {
      return [";", print(childPath)];
    }
  };

const transformMap: Partial<CstToDocMap> = {
  program: (path, print) => path.map(printLineWith(print), "statements"),
  empty: () => [],
  select_stmt: (path, print) => group(join(line, print("clauses") as Doc[])),
  select_clause: (path, print) =>
    group([print("selectKw"), indent([line, print("columns")])]),
  from_clause: (path, print) =>
    group([print("fromKw"), indent([line, print("expr")])]),
  where_clause: (path, print) =>
    group([print("whereKw"), indent([line, print("expr")])]),
  order_by_clause: (path, print) =>
    group([
      join(" ", print("orderByKw") as Doc[]),
      indent([line, print("specifications")]),
    ]),
  sort_specification: (path, print) =>
    join(" ", print(["expr", "orderKw"]) as Doc[]),
  alias: (path, print) => join(" ", print(["expr", "asKw", "alias"]) as Doc[]),
  list_expr: (path, print) => join([",", line], print("items") as []),
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
  member_expr: (path, print) => [print("object"), ".", print("property")],
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

  if (isArray(node)) {
    return path.map(print);
  }

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
