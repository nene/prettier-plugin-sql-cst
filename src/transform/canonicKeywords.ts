import { cstVisitor, Program } from "sql-parser-cst";

export const canonicKeywords = (cst: Program): Program => {
  cstVisitor({
    // Replaces TEMP with TEMPORARY
    create_table_stmt: (node) => {
      if (node.temporaryKw && node.temporaryKw.name === "TEMP") {
        node.temporaryKw.name = "TEMPORARY";
        node.temporaryKw.text = "TEMPORARY";
      }
    },
    // Replaces MySQL SELECT DISTINCTROW with SELECT DISTINCT
    select_distinct: (node) => {
      if (node.distinctKw.name === "DISTINCTROW") {
        node.distinctKw.name = "DISTINCT";
        node.distinctKw.text = "DISTINCT";
      }
    },
  })(cst);

  return cst;
};
