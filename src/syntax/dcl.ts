import { AllDclNodes } from "sql-parser-cst";
import { group, indent, join, line } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const dclMap: Partial<CstToDocMap<AllDclNodes>> = {
  grant_privilege_stmt: (print) =>
    group(
      join(print.dynamicLine(), [
        group([print("grantKw"), indent([line, print("privileges")])]),
        group(print.spaced(["onKw", "resource"])),
        group([print("toKw"), indent([line, print("roles")])]),
        ...print("clauses"),
      ]),
    ),
  revoke_privilege_stmt: (print) =>
    group(
      join(print.dynamicLine(), [
        group([print("revokeKw"), indent([line, print("privileges")])]),
        group(print.spaced(["onKw", "resource"])),
        group([print("fromKw"), indent([line, print("roles")])]),
      ]),
    ),

  privilege: (print) => print.spaced(["privilegeKw", "columns"]),
  all_privileges: (print) => print.spaced(["allKw", "privilegesKw", "columns"]),

  grant_resource_table: (print) => group(print.spaced(["tableKw", "tables"])),
  grant_resource_view: (print) => group(print.spaced(["viewKw", "views"])),
  grant_resource_schema: (print) =>
    group(print.spaced(["schemaKw", "schemas"])),
  grant_resource_sequence: (print) =>
    group(print.spaced(["sequenceKw", "sequences"])),
  grant_resource_database: (print) =>
    group(print.spaced(["databaseKw", "databases"])),
  grant_resource_domain: (print) =>
    group(print.spaced(["domainKw", "domains"])),
  grant_resource_foreign_data_wrapper: (print) =>
    group(print.spaced(["foreignDataWrapperKw", "dataWrappers"])),
  grant_resource_foreign_server: (print) =>
    group(print.spaced(["foreignServerKw", "servers"])),
  grant_resource_function: (print) =>
    group(print.spaced(["functionKw", "functions"])),
  grant_resource_language: (print) =>
    group(print.spaced(["languageKw", "languages"])),
  grant_resource_large_object: (print) =>
    group(print.spaced(["largeObjectKw", "oids"])),
  grant_resource_postgresql_option: (print) =>
    group(print.spaced(["parameterKw", "options"])),
  grant_resource_tablespace: (print) =>
    group(print.spaced(["tablespaceKw", "tablespaces"])),
  grant_resource_type: (print) => group(print.spaced(["typeKw", "types"])),

  grant_resource_all_tables_in_schema: (print) =>
    group(print.spaced(["allTablesInSchemaKw", "schemas"])),
  grant_resource_all_sequences_in_schema: (print) =>
    group(print.spaced(["allSequencesInSchemaKw", "schemas"])),
  grant_resource_all_functions_in_schema: (print) =>
    group(print.spaced(["allFunctionsInSchemaKw", "schemas"])),

  with_grant_option_clause: (print) =>
    group(print.spaced(["withKw", "nameKw", "value"])),
  granted_by_clause: (print) => group(print.spaced(["grantedByKw", "role"])),

  grantee_public: (print) => print("publicKw"),
  grantee_group: (print) => group(print.spaced(["groupKw", "name"])),
};
