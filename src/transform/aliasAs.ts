import { cstVisitor, Program } from "sql-parser-cst";

// Adds AS keyword to aliases if none exists
export const processAliasAs = (cst: Program): Program => {
  cstVisitor({
    alias: (node) => {
      node.asKw = node.asKw || { type: "keyword", name: "AS", text: "AS" };
    },
  })(cst);

  return cst;
};
