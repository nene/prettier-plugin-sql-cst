import { cstVisitor, Program } from "sql-parser-cst";

// Replaces PostgreSQL deprecated := operator with =>
export const namedArguments = (cst: Program): Program => {
  cstVisitor({
    named_arg: (node) => {
      if (node.operator === ":=") {
        node.operator = "=>";
      }
    },
  })(cst);

  return cst;
};
