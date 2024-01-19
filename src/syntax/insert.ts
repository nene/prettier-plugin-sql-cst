import { AllInsertNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import {
  join,
  group,
  hardline,
  indent,
  containsNewline,
  line,
} from "../print_utils";

export const insertMap: CstToDocMap<AllInsertNodes> = {
  insert_stmt: (print, node, path, opts) => {
    const lineType = containsNewline(node, opts) ? hardline : line;
    return group(join(lineType, print("clauses")));
  },
  insert_clause: (print, node, path, opts) => {
    const lineType = containsNewline(node, opts) ? hardline : line;
    return group([
      print.spaced(["insertKw", "modifiers", "orAction", "intoKw", "table"]),
      node.columns ? indent([lineType, print("columns")]) : [],
    ]);
  },
  values_clause: (print, node, path, opts) => {
    const lineType = containsNewline(node, opts) ? hardline : line;
    return group([print("valuesKw"), indent([lineType, print("values")])]);
  },
  or_alternate_action: (print) => print.spaced(["orKw", "actionKw"]),
  default: (print) => print("defaultKw"),
  default_values: (print) => print.spaced("defaultValuesKw"),
  upsert_clause: (print) =>
    print.spaced(["onConflictKw", "conflictTarget", "where", "doKw", "action"]),
  conflict_target_on_constraint: (print) =>
    print.spaced(["onConstraintKw", "constraint"]),
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
  overriding_clause: (print) => print.spaced("overridingKw"),
};
