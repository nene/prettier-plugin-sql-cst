import { DropTableStmt } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";

export const dropTableMap: CstToDocMap<DropTableStmt> = {
  drop_table_stmt: (print) =>
    print.spaced([
      "dropKw",
      "externalKw",
      "snapshotKw",
      "tableKw",
      "ifExistsKw",
      "tables",
    ]),
};
