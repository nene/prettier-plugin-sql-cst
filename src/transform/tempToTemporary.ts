import { cstVisitor, Program } from "sql-parser-cst";

// Replaces TEMP with TEMPORARY
export const tempToTemporary = (cst: Program): Program => {
  const mutateTemp = cstVisitor({
    create_table_stmt: (node) => {
      if (node.temporaryKw && node.temporaryKw.name === "TEMP") {
        node.temporaryKw.name = "TEMPORARY";
        node.temporaryKw.text = "TEMPORARY";
      }
    },
  });

  mutateTemp(cst);

  return cst;
};
