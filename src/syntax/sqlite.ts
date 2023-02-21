import { AllSqliteNodes } from "sql-parser-cst";
import { hardline, join } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const sqliteMap: Partial<CstToDocMap<AllSqliteNodes>> = {
  attach_database_stmt: (print) =>
    print.spaced(["attachKw", "databaseKw", "file", "asKw", "schema"]),
  detach_database_stmt: (print) =>
    print.spaced(["detachKw", "databaseKw", "schema"]),
  create_virtual_table_stmt: (print) =>
    join(hardline, [
      print.spaced(["createVirtualTableKw", "ifNotExistsKw", "name"]),
      print.spaced(["usingKw", "module"]),
    ]),
};
