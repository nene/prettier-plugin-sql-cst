import { Node } from "sql-parser-cst";
import { AstPath, Doc } from "prettier";
import { PrintableKey, PrintFn } from "./PrintFn";
import { AllPrettierOptions } from "./options";

export type NodeByType<TType, TNode> = Extract<TNode, { type: TType }>;

export type ToDocFn<TNode> = (
  // Note: the second type argument could technically be inferred by TypeScript,
  // but the analyze-field-access script relies on it being explicitly present.
  print: PrintFn<TNode, PrintableKey<TNode>>,
  node: TNode,
  path: AstPath<TNode>,
  options: AllPrettierOptions<TNode>,
) => Doc;

export type CstToDocMap<TNode extends Node> = {
  [TType in TNode["type"]]: ToDocFn<NodeByType<TType, TNode>>;
};
