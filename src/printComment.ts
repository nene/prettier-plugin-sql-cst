import { AstPath } from "prettier";
import { Whitespace } from "sql-parser-cst";

export const printComment = (path: AstPath<Whitespace>): string => {
  const node = path.node;
  if (node.type === "line_comment") {
    if (/^--[^ \t]/.test(node.text)) {
      return node.text.replace(/^--/, "-- ");
    }
    if (/^#[^ \t!]/.test(node.text)) {
      return node.text.replace(/^#/, "# ");
    }
  }
  return node.text;
};
