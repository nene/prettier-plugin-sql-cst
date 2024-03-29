import { cstVisitor, Program } from "sql-parser-cst";
import { isEmpty } from "../node_utils";
import { last } from "../utils";

// Removes trailing comma from SELECT clauses
export const stripTrailingCommas = (cst: Program): Program => {
  // Trailing comma is represented as an empty element at the end of column list
  cstVisitor({
    select_clause: (node) => {
      if (node.columns && isEmpty(last(node.columns.items))) {
        node.columns.items = node.columns.items.slice(0, -1);
      }
    },
  })(cst);

  return cst;
};
