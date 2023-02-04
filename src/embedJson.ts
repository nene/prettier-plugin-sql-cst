import { Doc, Printer } from "prettier";
import { Node } from "sql-parser-cst";
import deepEqual from "deep-equal";
import { isJsonLiteral, isStringLiteral } from "./node_utils";
import { isArray, last } from "./utils";
import { ifBreak, indent, softline } from "./print_utils";

export const embedJson: Printer<Node>["embed"] = (
  path,
  print,
  textToDoc,
  options
) => {
  const node = path.getValue();
  const parent = path.getParentNode();
  if (isStringLiteral(node) && isJsonLiteral(parent)) {
    const json = textToDoc(node.value, {
      ...options,
      parser: "json",
    });
    return [
      ifBreak("'''", "'"),
      indent([softline, trimFinalNewline(json)]),
      softline,
      ifBreak("'''", "'"),
    ];
  }
  return null;
};

const trimFinalNewline = (doc: Doc): Doc => {
  return isArray(doc) && isFinalNewline(last(doc)) ? doc.slice(0, -1) : doc;
};

const isFinalNewline = (doc: Doc): boolean => {
  return deepEqual(doc, {
    type: "concat",
    parts: [{ type: "line", hard: true }, { type: "break-parent" }],
  });
};
