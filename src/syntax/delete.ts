import { AllDeleteNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { group, hardline, join } from "../print_utils";

export const deleteMap: CstToDocMap<AllDeleteNodes> = {
  delete_stmt: (print) => group(join(print.dynamicLine(), print("clauses"))),
  delete_clause: (print) =>
    print.spaced(["deleteKw", "modifiers", "fromKw", "tables"]),
};
