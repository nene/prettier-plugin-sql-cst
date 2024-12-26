import { AllAlterActionNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { group, indent, join, line } from "../print_utils";

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
  alter_action_add_constraint: (print) =>
    print.spaced(["addKw", "name", "constraint", "modifiers"]),
  alter_action_add_constraint_constraint_name: (print) =>
    print.spaced(["constraintKw", "ifNotExistsKw", "name"]),
  alter_action_drop_constraint: (print) =>
    print.spaced([
      "dropConstraintKw",
      "ifExistsKw",
      "constraint",
      "behaviorKw",
    ]),
  alter_action_drop_primary_key: (print) =>
    print.spaced(["dropPrimaryKeyKw", "ifExistsKw"]),
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
  alter_action_set_postgresql_options: (print) =>
    print.spaced(["setKw", "options"]),
  alter_action_reset_postgresql_options: (print) =>
    print.spaced(["resetKw", "options"]),
  alter_action_depends_on_extension: (print) =>
    print.spaced(["dependsOnExtensionKw", "extension"]),
  alter_action_no_depends_on_extension: (print) =>
    print.spaced(["noDependsOnExtensionKw", "extension"]),
  alter_action_attach_partition: (print) =>
    print.spaced(["attachPartitionKw", "index"]),
  alter_action_add_enum_value: (print) =>
    print.spaced(["addValueKw", "ifNotExistsKw", "value", "position"]),
  alter_action_add_enum_value_position: (print) =>
    print.spaced(["positionKw", "value"]),
  alter_action_rename_enum_value: (print) =>
    print.spaced(["renameValueKw", "oldValue", "toKw", "newValue"]),
  alter_action_add_attribute: (print) =>
    print.spaced([
      "addAttributeKw",
      "name",
      "dataType",
      "constraint",
      "behaviorKw",
    ]),
  alter_action_drop_attribute: (print) =>
    print.spaced(["dropAttributeKw", "ifExistsKw", "name", "behaviorKw"]),
  alter_action_alter_attribute: (print) =>
    print.spaced([
      "alterAttributeKw",
      "name",
      "setDataTypeKw",
      "dataType",
      "constraint",
      "behaviorKw",
    ]),
  alter_action_rename_attribute: (print) =>
    print.spaced([
      "renameAttributeKw",
      "oldName",
      "toKw",
      "newName",
      "behaviorKw",
    ]),

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
    print.spaced(["setDataTypeKw", "dataType", "clauses"]),
  alter_action_set_statistics: (print) =>
    print.spaced(["setStatisticsKw", "value"]),
  alter_action_set_compression: (print) =>
    print.spaced(["setCompressionKw", "method"]),
  alter_action_set_storage: (print) => print.spaced(["setStorageKw", "typeKw"]),
  alter_action_drop_expression: (print) =>
    print.spaced(["dropExpressionKw", "ifExistsKw"]),
  alter_action_drop_identity: (print) =>
    print.spaced(["dropIdentityKw", "ifExistsKw"]),
  alter_action_add_identity: (print) =>
    print.spaced([
      "addGeneratedKw",
      "whenKw",
      "asIdentityKw",
      "sequenceOptions",
    ]),
  alter_action_alter_identity: (print) => group(join(line, print("actions"))),
  alter_action_set_generated: (print) =>
    print.spaced(["setGeneratedKw", "whenKw"]),
  alter_action_restart: (print) =>
    print.spaced(["restartKw", "withKw", "value"]),
  alter_action_set_sequence_option: (print) =>
    print.spaced(["setKw", "option"]),
  alter_action_with_role_options: (print, node) =>
    node.withKw
      ? group([print("withKw"), indent([line, join(line, print("options"))])])
      : // This works in tandem with the logic inside alter_role_stmt
        group(join(line, print("options"))),
  alter_action_set_postgresql_option: (print) =>
    print.spaced(["setKw", "name", "operator", "value"]),
  alter_action_reset_postgresql_option: (print) =>
    print.spaced(["resetKw", "name"]),

  // ENABLE/DISABLE ..
  toggle_trigger: (print) => print.spaced(["triggerKw", "name"]),
  toggle_rule: (print) => print.spaced(["ruleKw", "name"]),
  toggle_row_level_security: (print) => print.spaced("rowLevelSecurityKw"),

  // SET DATA TYPE ...
  set_data_type_collate_clause: (print) =>
    print.spaced(["collateKw", "collation"]),
  set_data_type_using_clause: (print) => print.spaced(["usingKw", "expr"]),
};
