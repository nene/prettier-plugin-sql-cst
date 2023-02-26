import { Doc, doc, util } from "prettier";
import { Node } from "sql-parser-cst";
import { isArray } from "./utils";

export const {
  line,
  hardline,
  softline,
  indent,
  group,
  lineSuffix,
  ifBreak,
  breakParent,
} = doc.builders;

const { join: origJoin } = doc.builders;

export const { stripTrailingHardline } = doc.utils;

/** Improved join() that also accepts a non-array docs parameter */
export const join = (sep: Doc, docs: Doc): Doc =>
  isArray(docs) ? origJoin(sep, docs) : docs;

/** True when the Node contains a newline in original source code */
export const containsNewline = (
  node: Node,
  opts: { originalText: string }
): boolean => {
  if (!node.range) {
    throw new Error("containsNewline() expected a Node with range info");
  }
  return util.hasNewlineInRange(
    opts.originalText,
    node.range[0],
    node.range[1]
  );
};

export const hasEmptyLineBetweenNodes = (
  node1: Node,
  node2: Node,
  opts: { originalText: string }
): boolean => {
  if (!node1.range || !node2.range) {
    throw new Error("emptyLineBetweenNodes() expects Nodes with range info");
  }

  return /\n[ \t]*\r?\n/.test(
    opts.originalText.slice(node1.range[1], node2.range[0])
  );
};
