import { AllSqliteNodes } from "sql-parser-cst";
import { hardline, join } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const sqliteMap: Partial<CstToDocMap<AllSqliteNodes>> = {
  create_virtual_table_stmt: (print) =>
    join(hardline, [
      print.spaced(["createVirtualTableKw", "ifNotExistsKw", "name"]),
      print.spaced(["usingKw", "module"]),
    ]),
};
