import { Node } from "sql-parser-cst";
import { AstPath, Doc, ParserOptions } from "prettier";
import { join, line, hardline, softline, indent, group } from "./print_utils";
import { PrintFn } from "./PrintFn";
import { isArray, isString } from "./utils";

type NodeByType<TType, TNode> = Extract<TNode, { type: TType }>;

type ToDocFn<TNode> = (
  print: PrintFn<TNode>,
  path: AstPath<TNode>,
  options: ParserOptions<TNode>
) => Doc;

type CstToDocMap<TNode extends Node> = {
  [TType in TNode["type"]]: ToDocFn<NodeByType<TType, TNode>>;
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

const transformMap: Partial<CstToDocMap<Node>> = {
  program: (print, path) => path.map(printLineWith(print), "statements"),
  empty: () => [],
  select_stmt: (print) => group(join(line, print("clauses"))),
  select_clause: (print) =>
    group([print("selectKw"), indent([line, print("columns")])]),
  from_clause: (print) =>
    group([print("fromKw"), indent([line, print("expr")])]),
  where_clause: (print) =>
    group([print("whereKw"), indent([line, print("expr")])]),
  order_by_clause: (print) =>
    group([
      join(" ", print("orderByKw")),
      indent([line, print("specifications")]),
    ]),
  sort_specification: (print) => join(" ", print(["expr", "orderKw"])),
  alias: (print) => join(" ", print(["expr", "asKw", "alias"])),
  list_expr: (print) => join([",", line], print("items")),
  paren_expr: (print, path) => {
    const parent = path.getParentNode() as Node;
    if (parent?.type === "func_call") {
      return ["(", indent([softline, print("expr")]), softline, ")"];
    } else {
      return ["(", print("expr"), ")"];
    }
  },
  binary_expr: (print) => join(" ", print(["left", "operator", "right"])),
  member_expr: (print) => [print("object"), ".", print("property")],
  func_call: (print) => group(print(["name", "args"])),
  func_args: (print) => print("args"),
  keyword: (print, path) => path.getValue().text,
  number_literal: (print) => print("text"),
  boolean_literal: (print) => print("text"),
  identifier: (print) => print("text"),
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
