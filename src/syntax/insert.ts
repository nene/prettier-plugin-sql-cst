import { AllInsertNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { join, group, hardline, indent } from "../print_utils";

export const insertMap: Partial<CstToDocMap<AllInsertNodes>> = {
  insert_stmt: (print) => join(hardline, print("clauses")),
  insert_clause: (print, node) =>
    group([
      print.spaced(["insertKw", "orAction", "intoKw", "table"]),
      node.columns ? indent([hardline, print("columns")]) : [],
    ]),
  values_clause: (print) =>
    group([print("valuesKw"), indent([hardline, print("values")])]),
  or_alternate_action: (print) => print.spaced(["orKw", "actionKw"]),
};
