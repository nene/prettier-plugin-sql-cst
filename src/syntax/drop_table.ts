import { DropTableStmt } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";

export const dropTableMap: CstToDocMap<DropTableStmt> = {
  drop_table_stmt: (print) =>
    print.spaced(["dropKw", "kind", "tableKw", "ifExistsKw", "tables"]),
};
