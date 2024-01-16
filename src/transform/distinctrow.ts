import { cstVisitor, Program } from "sql-parser-cst";

// Replaces MySQL SELECT DISTINCTROW with SELECT DISTINCT
export const distinctrow = (cst: Program): Program => {
  cstVisitor({
    select_distinct: (node) => {
      if (node.distinctKw.name === "DISTINCTROW") {
        node.distinctKw.name = "DISTINCT";
        node.distinctKw.text = "DISTINCT";
      }
    },
  })(cst);

  return cst;
};
