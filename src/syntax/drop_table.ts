import { DropTableStmt } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { group } from "../print_utils";

export const dropTableMap: CstToDocMap<DropTableStmt> = {
  drop_table_stmt: (print) =>
    group(
      print.spaced([
        "dropKw",
        "kind",
        "tableKw",
        "ifExistsKw",
        "tables",
        "behaviorKw",
      ]),
    ),
};
