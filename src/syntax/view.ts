import { AllViewStatements } from "sql-parser-cst";
import { hardline, join } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const viewMap: CstToDocMap<AllViewStatements> = {
  create_view_stmt: (print, node) => {
    const hasOnlyAsClause = node.clauses.length === 1;
    const hasManyClauses = node.clauses.length > 1;
    return [
      print.spaced([
        "createKw",
        "orReplaceKw",
        "temporaryKw",
        "materializedKw",
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
    print.spaced(["dropKw", "materializedKw", "viewKw", "ifExistsKw", "views"]),
  alter_view_stmt: (print) => [
    print.spaced(["alterKw", "materializedKw", "viewKw", "ifExistsKw", "name"]),
    hardline,
    join(hardline, print("actions")),
  ],
};
