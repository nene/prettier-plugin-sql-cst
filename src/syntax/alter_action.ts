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
  alter_action_enable: (print) => print.spaced(["enableKw", "modeKw", "item"]),
  alter_action_disable: (print) => print.spaced(["disableKw", "item"]),
  alter_action_force: (print) => print.spaced(["forceKw", "item"]),
  alter_action_no_force: (print) => print.spaced(["noForceKw", "item"]),
  alter_action_cluster_on: (print) => print.spaced(["clusterOnKw", "index"]),
  alter_action_set_without_cluster: (print) =>
    print.spaced("setWithoutClusterKw"),
  alter_action_set_without_oids: (print) => print.spaced("setWithoutOidsKw"),
  alter_action_set_access_method: (print) =>
    print.spaced(["setAccessMethodKw", "method"]),
  alter_action_set_logged: (print) => print.spaced("setLoggedKw"),
  alter_action_set_unlogged: (print) => print.spaced("setUnloggedKw"),
  alter_action_inherit: (print) => print.spaced(["inheritKw", "table"]),
  alter_action_no_inherit: (print) => print.spaced(["noInheritKw", "table"]),
  alter_action_of_type: (print) => print.spaced(["ofKw", "typeName"]),
  alter_action_not_of_type: (print) => print.spaced("notOfKw"),
  alter_action_owner_to: (print) => print.spaced(["ownerToKw", "owner"]),
  alter_action_replica_identity: (print) =>
    print.spaced(["replicaIdentityKw", "identity"]),
  replica_identity_using_index: (print) =>
    print.spaced(["usingIndexKw", "index"]),

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

  // ENABLE/DISABLE ..
  toggle_trigger: (print) => print.spaced(["triggerKw", "name"]),
  toggle_rule: (print) => print.spaced(["ruleKw", "name"]),
  toggle_row_level_security: (print) => print.spaced("rowLevelSecurityKw"),
};
