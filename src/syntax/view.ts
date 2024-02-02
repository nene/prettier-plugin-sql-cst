import { AllViewStatements } from "sql-parser-cst";
import { hardline, join } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const viewMap: Partial<CstToDocMap<AllViewStatements>> = {
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
  drop_view_stmt: (print) =>
    print.spaced([
      "dropKw",
      "kind",
      "viewKw",
      "ifExistsKw",
      "views",
      "behaviorKw",
    ]),
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
    join(hardline, print("actions")),
  ],
};
