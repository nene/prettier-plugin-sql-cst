import { AllViewNodes } from "sql-parser-cst";
import { group, hardline, join, line } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const viewMap: Partial<CstToDocMap<AllViewNodes>> = {
  create_view_stmt: (print, node) => {
    const hasOnlyAsClause = node.clauses.length === 1;
    const hasManyClauses = node.clauses.length > 1;
    return [
      print.spaced([
        "createKw",
        "orReplaceKw",
        "kinds",
        "viewKw",
        "ifNotExistsKw",
        "name",
        "columns",
      ]),
      hasOnlyAsClause ? [" ", print("clauses")] : [],
      hasManyClauses ? [hardline, join(hardline, print("clauses"))] : [],
    ];
  },
  with_check_option_clause: (print) =>
    print.spaced(["withKw", "levelKw", "checkOptionKw"]),

  drop_view_stmt: (print) =>
    group(
      print.spaced([
        "dropKw",
        "kind",
        "viewKw",
        "ifExistsKw",
        "views",
        "behaviorKw",
      ]),
    ),
  alter_view_stmt: (print) => [
    print.spaced([
      "alterKw",
      "kind",
      "viewKw",
      "ifExistsKw",
      "name",
      "columns",
    ]),
    hardline,
    print("actions"),
  ],

  refresh_materialized_view_stmt: (print, node) =>
    group([
      print.spaced(["refreshMaterializedViewKw", "concurrentlyKw", "name"]),
      node.clauses.length > 0
        ? [print.dynamicLine(), join(line, print("clauses"))]
        : [],
    ]),
};
