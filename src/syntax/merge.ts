import { AllMergeNodes } from "sql-parser-cst";
import { group, hardline, indent, join, line } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const mergeMap: CstToDocMap<AllMergeNodes> = {
  merge_stmt: (print) => group(join(hardline, print("clauses"))),
  merge_clause: (print) =>
    join(line, [
      print.spaced(["mergeKw", "intoKw", "target"]),
      print.spaced(["usingKw", "source"]),
      group([print("onKw"), indent([line, print("condition")])]),
    ]),
  merge_when_clause: (print, node) => [
    group([
      print.spaced(["whenKw", "matchedKw", "byKw"]),
      node.condition ? indent([line, print("condition")]) : [],
      [line, print("thenKw")],
    ]),
    indent([hardline, group(print("action"))]),
  ],
  merge_when_condition: (print) => print.spaced(["andKw", "expr"]),
  merge_action_delete: (print) => print("deleteKw"),
  merge_action_insert: (print, node) => [
    group([
      print("insertKw"),
      node.columns ? indent([hardline, print("columns")]) : [],
    ]),
    line,
    join(hardline, print("clauses")),
  ],
  merge_action_insert_row_clause: (print) => print("rowKw"),
  merge_action_update: (print) => print.spaced(["updateKw", "set"]),
  merge_action_do_nothing: (print) => print.spaced(["doNothingKw"]),
};
