import { AllAlterActionNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { group } from "../print_utils";

export const alterActionMap: Partial<CstToDocMap<AllAlterActionNodes>> = {
  alter_action_rename: (print) => print.spaced(["renameKw", "newName"]),
  alter_action_rename_column: (print) =>
    print.spaced(["renameKw", "ifExistsKw", "oldName", "toKw", "newName"]),
  alter_action_add_column: (print) =>
    print.spaced(["addKw", "ifNotExistsKw", "column"]),
  alter_action_drop_column: (print) =>
    print.spaced(["dropKw", "ifExistsKw", "column", "behaviorKw"]),
  alter_action_set_bigquery_options: (print) =>
    print.spaced(["setKw", "options"]),
  alter_action_set_default_collate: (print) =>
    print.spaced(["setDefaultCollateKw", "collation"]),
  alter_action_add_constraint: (print) => print.spaced(["addKw", "constraint"]),
  alter_action_drop_constraint: (print) =>
    print.spaced([
      "dropConstraintKw",
      "ifExistsKw",
      "constraint",
      "behaviorKw",
    ]),
  alter_action_alter_constraint: (print) =>
    print.spaced(["alterConstraintKw", "constraint", "modifiers"]),
  alter_action_rename_constraint: (print) =>
    print.spaced(["renameConstraintKw", "oldName", "toKw", "newName"]),
  alter_action_validate_constraint: (print) =>
    print.spaced(["validateConstraintKw", "constraint"]),
  alter_action_set_visible: (print) => print.spaced("setVisibleKw"),
  alter_action_set_invisible: (print) => print.spaced("setInvisibleKw"),
  alter_action_set_tablespace: (print) =>
    print.spaced(["setTablespaceKw", "tablespace", "nowaitKw"]),
  alter_action_set_schema: (print) => print.spaced(["setSchemaKw", "schema"]),

  // ALTER COLUMN
  alter_action_alter_column: (print) =>
    group([
      print.spaced(["alterKw", "ifExistsKw", "column"]),
      print.dynamicLine(),
      print("action"),
    ]),
  alter_action_set_default: (print) => print.spaced(["setDefaultKw", "expr"]),
  alter_action_drop_default: (print) => print.spaced("dropDefaultKw"),
  alter_action_set_not_null: (print) => print.spaced("setNotNullKw"),
  alter_action_drop_not_null: (print) => print.spaced("dropNotNullKw"),
  alter_action_set_data_type: (print) =>
    print.spaced(["setDataTypeKw", "dataType"]),
};
