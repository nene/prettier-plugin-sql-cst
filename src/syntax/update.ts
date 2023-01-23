import { AllUpdateNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { join, hardline, indent } from "../print_utils";

export const updateMap: Partial<CstToDocMap<AllUpdateNodes>> = {
  update_stmt: (print) => join(hardline, print("clauses")),
  update_clause: (print) =>
    print.spaced(["updateKw", "options", "orAction", "tables"]),
  set_clause: (print, node) => {
    if (node.assignments.items.length > 1) {
      return [print("setKw"), indent([hardline, print("assignments")])];
    } else {
      return print.spaced(["setKw", "assignments"]);
    }
  },
  column_assignment: (print) =>
    join([" ", "=", " "], print(["column", "expr"])),
};
