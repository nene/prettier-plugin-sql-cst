import { Doc, doc, util } from "prettier";
import { Node } from "sql-parser-cst";
import { isArray } from "./utils";

export const { line, hardline, softline, indent, group, lineSuffix } =
  doc.builders;

const { join: origJoin } = doc.builders;

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
