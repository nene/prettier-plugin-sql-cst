import { Doc, doc, util } from "prettier";
import { Node, Whitespace } from "sql-parser-cst";
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
  opts: { originalText: string },
): boolean => {
  if (!node.range) {
    throw new Error("containsNewline() expected a Node with range info");
  }
  return util.hasNewlineInRange(
    opts.originalText,
    node.range[0],
    node.range[1],
  );
};

export const hasEmptyLineBetweenNodes = (
  node1: Node,
  node2: Node,
  opts: { originalText: string },
): boolean => {
  if (!node1.range || !node2.range) {
    throw new Error("emptyLineBetweenNodes() expects Nodes with range info");
  }
  const start = node1.range[1];
  const end = node2.range[0];

  const indexes = emptyLineIndexes(opts.originalText.slice(start, end)).map(
    (i) => start + i,
  );

  // when no empty lines between nodes, we can return early
  if (indexes.length === 0) {
    return false;
  }

  // otherwise we need to check whether the empty line happens to be inside a comment
  const comments = [...(node1.trailing ?? []), ...(node2.leading ?? [])].filter(
    isBlockComment,
  );
  return (
    indexes.filter((index) => !isIndexInsideComment(index, comments)).length > 0
  );
};

function emptyLineIndexes(text: string): number[] {
  const indexes: number[] = [];
  const re = /\n[ \t]*\r?\n/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    indexes.push(match.index);
  }
  return indexes;
}

function isBlockComment(comment: Whitespace): boolean {
  return comment.type === "block_comment";
}

function isIndexInsideComment(index: number, comments: Whitespace[]): boolean {
  return comments.some((comment) => {
    if (!comment.range) {
      return false;
    }
    return comment.range[0] < index && index < comment.range[1];
  });
}
