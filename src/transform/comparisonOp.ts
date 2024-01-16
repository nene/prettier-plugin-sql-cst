import { cstVisitor, Program } from "sql-parser-cst";

// Replaces <> operator with !=
export const comparisonOp = (cst: Program): Program => {
  cstVisitor({
    binary_expr: (node) => {
      if (node.operator === "<>") {
        node.operator = "!=";
      }
    },
  })(cst);

  return cst;
};
