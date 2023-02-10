import { AlterTableStmt, AllAlterActionNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { hardline } from "../print_utils";

export const alterTableMap: Partial<
  CstToDocMap<AlterTableStmt | AllAlterActionNodes>
> = {
  alter_table_stmt: (print) => [
    print.spaced(["alterTableKw", "ifExistsKw", "table"]),
    hardline,
    print("actions"),
  ],
  alter_action_rename_table: (print) => print.spaced(["renameKw", "newName"]),
  alter_action_rename_column: (print) =>
    print.spaced(["renameKw", "ifExistsKw", "oldName", "toKw", "newName"]),
  alter_action_add_column: (print) =>
    print.spaced(["addKw", "ifNotExistsKw", "column"]),
  alter_action_drop_column: (print) =>
    print.spaced(["dropKw", "ifExistsKw", "column"]),
};
