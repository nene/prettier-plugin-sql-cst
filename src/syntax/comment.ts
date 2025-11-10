import { AllCommentNodes } from "sql-parser-cst";
import { group, indent, line } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const commentMap: CstToDocMap<AllCommentNodes> = {
  comment_stmt: (print) =>
    group([
      print.spaced(["commentKw", "onKw", "target", "isKw"]),
      indent([line, print("message")]),
    ]),

  comment_target_aggregate: (print) =>
    group([print.spaced(["aggregateKw", "name"]), print(["params"])]),
  comment_target_function: (print) =>
    group([print.spaced(["functionKw", "name"]), print(["params"])]),
  comment_target_procedure: (print) =>
    group([print.spaced(["procedureKw", "name"]), print(["params"])]),
  comment_target_routine: (print) =>
    group([print.spaced(["routineKw", "name"]), print(["params"])]),

  comment_target_access_method: (print) =>
    group(print.spaced(["accessMethodKw", "name"])),
  comment_target_cast: (print) => group(print.spaced(["castKw", "args"])),
  comment_target_collation: (print) =>
    group(print.spaced(["collationKw", "name"])),
  comment_target_column: (print) => group(print.spaced(["columnKw", "name"])),
  comment_target_table_constraint: (print) =>
    group(print.spaced(["constraintKw", "name", "onKw", "tableName"])),
  comment_target_domain_constraint: (print) =>
    group(
      print.spaced(["constraintKw", "name", "onKw", "domainKw", "domainName"]),
    ),
  comment_target_conversion: (print) =>
    group(print.spaced(["conversionKw", "name"])),
  comment_target_database: (print) =>
    group(print.spaced(["databaseKw", "name"])),
  comment_target_domain: (print) => group(print.spaced(["domainKw", "name"])),
  comment_target_extension: (print) =>
    group(print.spaced(["extensionKw", "name"])),
  comment_target_event_trigger: (print) =>
    group(print.spaced(["eventTriggerKw", "name"])),
  comment_target_foreign_data_wrapper: (print) =>
    group(print.spaced(["foreignDataWrapperKw", "name"])),
  comment_target_foreign_table: (print) =>
    group(print.spaced(["foreignTableKw", "name"])),
  comment_target_index: (print) => group(print.spaced(["indexKw", "name"])),
  comment_target_language: (print) =>
    group(print.spaced(["languageKw", "name"])),
  comment_target_large_object: (print) =>
    group(print.spaced(["largeObjectKw", "oid"])),
  comment_target_materialized_view: (print) =>
    group(print.spaced(["materializedViewKw", "name"])),
  comment_target_operator_class: (print) =>
    group(print.spaced(["operatorClassKw", "name", "usingKw", "methodName"])),
  comment_target_operator_family: (print) =>
    group(print.spaced(["operatorFamilyKw", "name", "usingKw", "methodName"])),
  comment_target_policy: (print) =>
    group(print.spaced(["policyKw", "name", "onKw", "tableName"])),
  comment_target_publication: (print) =>
    group(print.spaced(["publicationKw", "name"])),
  comment_target_role: (print) => group(print.spaced(["roleKw", "name"])),
  comment_target_rule: (print) =>
    group(print.spaced(["ruleKw", "name", "onKw", "tableName"])),
  comment_target_schema: (print) => group(print.spaced(["schemaKw", "name"])),
  comment_target_sequence: (print) =>
    group(print.spaced(["sequenceKw", "name"])),
  comment_target_server: (print) => group(print.spaced(["serverKw", "name"])),
  comment_target_statistics: (print) =>
    group(print.spaced(["statisticsKw", "name"])),
  comment_target_subscription: (print) =>
    group(print.spaced(["subscriptionKw", "name"])),
  comment_target_table: (print) => group(print.spaced(["tableKw", "name"])),
  comment_target_tablespace: (print) =>
    group(print.spaced(["tablespaceKw", "name"])),
  comment_target_text_search_configuration: (print) =>
    group(print.spaced(["textSearchConfigurationKw", "name"])),
  comment_target_text_search_dictionary: (print) =>
    group(print.spaced(["textSearchDictionaryKw", "name"])),
  comment_target_text_search_parser: (print) =>
    group(print.spaced(["textSearchParserKw", "name"])),
  comment_target_text_search_template: (print) =>
    group(print.spaced(["textSearchTemplateKw", "name"])),
  comment_target_transform: (print) =>
    group(
      print.spaced([
        "transformForKw",
        "typeName",
        "languageKw",
        "languageName",
      ]),
    ),
  comment_target_trigger: (print) =>
    group(print.spaced(["triggerKw", "name", "onKw", "tableName"])),
  comment_target_type: (print) => group(print.spaced(["typeKw", "name"])),
  comment_target_view: (print) => group(print.spaced(["viewKw", "name"])),
};
