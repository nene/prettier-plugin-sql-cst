import { Node } from "sql-parser-cst";
import { AstPath, Doc, ParserOptions } from "prettier";
import { PrintFn } from "./PrintFn";

export type NodeByType<TType, TNode> = Extract<TNode, { type: TType }>;

export type ToDocFn<TNode> = (
  print: PrintFn<TNode>,
  path: AstPath<TNode>,
  options: ParserOptions<TNode>
) => Doc;

export type CstToDocMap<TNode extends Node> = {
  [TType in TNode["type"]]: ToDocFn<NodeByType<TType, TNode>>;
};
