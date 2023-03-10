import { AllMergeNodes } from "sql-parser-cst";
import { group, hardline, indent, join, line } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const mergeMap: Partial<CstToDocMap<AllMergeNodes>> = {
  merge_stmt: (print) =>
    join(line, [
      print.spaced(["mergeKw", "intoKw", "target"]),
      print.spaced(["usingKw", "source"]),
      group([print("onKw"), indent([line, print("condition")])]),
      ...print("clauses").map((clause) => group(clause)),
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
    group(print("values")),
  ],
  merge_action_insert_row_clause: (print) => print("rowKw"),
  merge_action_update: (print) => print.spaced(["updateKw", "set"]),
};
