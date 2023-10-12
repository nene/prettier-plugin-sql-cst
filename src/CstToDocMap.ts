import { Node } from "sql-parser-cst";
import { AstPath, Doc } from "prettier";
import { PrintFn } from "./PrintFn";
import { AllPrettierOptions } from "./options";

export type NodeByType<TType, TNode> = Extract<TNode, { type: TType }>;

export type ToDocFn<TNode> = (
  print: PrintFn<TNode>,
  node: TNode,
  path: AstPath<TNode>,
  options: AllPrettierOptions<TNode>,
) => Doc;

export type CstToDocMap<TNode extends Node> = {
  [TType in TNode["type"]]: ToDocFn<NodeByType<TType, TNode>>;
};
