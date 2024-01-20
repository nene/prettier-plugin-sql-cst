import { AllInsertNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { join, group, hardline, indent, line } from "../print_utils";

export const insertMap: CstToDocMap<AllInsertNodes> = {
  insert_stmt: (print) => group(join(print.dynamicLine(), print("clauses"))),
  insert_clause: (print, node) =>
    group([
      print.spaced(["insertKw", "modifiers", "orAction", "intoKw", "table"]),
      node.columns ? indent([print.dynamicLine(), print("columns")]) : [],
    ]),
  values_clause: (print) =>
    group([print("valuesKw"), indent([print.dynamicLine(), print("values")])]),
  or_alternate_action: (print) => print.spaced(["orKw", "actionKw"]),
  default: (print) => print("defaultKw"),
  default_values: (print) => print.spaced("defaultValuesKw"),
  upsert_clause: (print) =>
    print.spaced(["onConflictKw", "conflictTarget", "where", "doKw", "action"]),
  conflict_target_on_constraint: (print) =>
    print.spaced(["onConstraintKw", "constraint"]),
  upsert_action_nothing: (print) => print("nothingKw"),
  upsert_action_update: (print) =>
    group([
      print("updateKw"),
      indent([
        print.dynamicLine(),
        join(print.dynamicLine(), print(["set", "where"])),
      ]),
    ]),
  row_alias_clause: (print, node) =>
    group([
      print.spaced(["asKw", "rowAlias"]),
      node.columnAliases
        ? indent([print.dynamicLine(), print("columnAliases")])
        : [],
    ]),
  on_duplicate_key_update_clause: (print) =>
    group([
      print.spaced("onDuplicateKeyUpdateKw"),
      indent([print.dynamicLine(), print("assignments")]),
    ]),
  overriding_clause: (print) => print.spaced("overridingKw"),
};
