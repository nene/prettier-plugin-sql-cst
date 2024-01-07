import { AllDeleteNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { hardline, join } from "../print_utils";

export const deleteMap: CstToDocMap<AllDeleteNodes> = {
  delete_stmt: (print) => join(hardline, print("clauses")),
  delete_clause: (print) =>
    print.spaced(["deleteKw", "modifiers", "fromKw", "tables"]),
};
