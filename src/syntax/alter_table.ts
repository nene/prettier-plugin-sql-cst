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
  alter_action_set_options: (print) => print.spaced(["setKw", "options"]),
  alter_action_set_default_collate: (print) =>
    print.spaced(["setDefaultCollateKw", "collation"]),
  alter_action_alter_column: (print) => [
    print.spaced(["alterKw", "ifExistsKw", "column"]),
    hardline,
    print("action"),
  ],
  alter_action_set_default: (print) => print.spaced(["setDefaultKw", "expr"]),
  alter_action_drop_default: (print) => print.spaced("dropDefaultKw"),
  alter_action_drop_not_null: (print) => print.spaced("dropNotNullKw"),
  alter_action_set_data_type: (print) =>
    print.spaced(["setDataTypeKw", "dataType"]),
};
