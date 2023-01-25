import { AlterTableStmt, AllAlterActionNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";

export const alterTableMap: Partial<
  CstToDocMap<AlterTableStmt | AllAlterActionNodes>
> = {
  alter_table_stmt: (print) =>
    print.spaced(["alterTableKw", "table", "actions"]),
  alter_action_rename_table: (print) => print.spaced(["renameKw", "newName"]),
  alter_action_rename_column: (print) =>
    print.spaced(["renameKw", "oldName", "toKw", "newName"]),
  alter_action_add_column: (print) => print.spaced(["addKw", "column"]),
  alter_action_drop_column: (print) => print.spaced(["dropKw", "column"]),
};
