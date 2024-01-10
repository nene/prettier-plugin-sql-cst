import { AllInsertNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { join, group, hardline, indent } from "../print_utils";

export const insertMap: Partial<CstToDocMap<AllInsertNodes>> = {
  insert_stmt: (print) => join(hardline, print("clauses")),
  insert_clause: (print, node) =>
    group([
      print.spaced(["insertKw", "modifiers", "orAction", "intoKw", "table"]),
      node.columns ? indent([hardline, print("columns")]) : [],
    ]),
  values_clause: (print) =>
    group([print("valuesKw"), indent([hardline, print("values")])]),
  or_alternate_action: (print) => print.spaced(["orKw", "actionKw"]),
  default: (print) => print("defaultKw"),
  default_values: (print) => print.spaced("defaultValuesKw"),
  upsert_clause: (print) =>
    print.spaced(["onConflictKw", "conflictTarget", "where", "doKw", "action"]),
  upsert_action_nothing: (print) => print("nothingKw"),
  upsert_action_update: (print) => [
    print("updateKw"),
    indent([hardline, join(hardline, print(["set", "where"]))]),
  ],
  row_alias_clause: (print, node) => [
    print.spaced(["asKw", "rowAlias"]),
    node.columnAliases ? indent([hardline, print("columnAliases")]) : [],
  ],
  on_duplicate_key_update_clause: (print) => [
    print.spaced("onDuplicateKeyUpdateKw"),
    indent([hardline, print("assignments")]),
  ],
};
