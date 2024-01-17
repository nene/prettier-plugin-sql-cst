import { cstVisitor, Program } from "sql-parser-cst";

export const canonicOperators = (cst: Program): Program => {
  cstVisitor({
    // Replaces <> operator with !=
    binary_expr: (node) => {
      if (node.operator === "<>") {
        node.operator = "!=";
      }
    },
    // Replaces PostgreSQL deprecated := operator with =>
    named_arg: (node) => {
      if (node.operator === ":=") {
        node.operator = "=>";
      }
    },
  })(cst);

  return cst;
};
