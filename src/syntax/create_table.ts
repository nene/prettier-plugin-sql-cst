import { AllCreateTableNodes, CreateTableStmt } from "sql-parser-cst";
import { isAsClause } from "../node_utils";
import { CstToDocMap, ToDocFn } from "../CstToDocMap";
import { group, join, line } from "../print_utils";

export const createTableMap: CstToDocMap<AllCreateTableNodes> = {
  create_table_stmt: (print, node, ...rest) => [
    print.spaced([
      "createKw",
      "orReplaceKw",
      "kind",
      "tableKw",
      "ifNotExistsKw",
      "name",
      "partitionOf",
      "ofType",
      "columns",
    ]),
    printClauses(print, node, ...rest),
    node.options ? [line, group(print("options"))] : [],
  ],
  table_kind: (print) => print.spaced("kindKw"),
  column_definition: (print) =>
    print.spaced(["name", "dataType", "withOptionsKw", "constraints"]),
  table_option: (print, node) => {
    if (node.value && node.hasEq) {
      return [print.spaced("name"), " = ", print.spaced("value")];
    } else if (node.value) {
      return [print.spaced("name"), " ", print.spaced("value")];
    } else {
      return print.spaced("name");
    }
  },
  create_table_like_clause: (print) =>
    print.spaced(["likeKw", "name", "options"]),
  table_like_option: (print) =>
    print.spaced(["includingOrExcludingKw", "optionKw"]),
  create_table_copy_clause: (print) => print.spaced(["copyKw", "name"]),
  create_table_clone_clause: (print) => print.spaced(["cloneKw", "table"]),
  with_partition_columns_clause: (print) =>
    print.spaced(["withPartitionColumnsKw", "columns"]),
  create_table_using_clause: (print) => print.spaced(["usingKw", "module"]),
  create_table_inherits_clause: (print) =>
    print.spaced(["inheritsKw", "tables"]),
  create_table_partition_by_clause: (print) =>
    print.spaced(["partitionByKw", "strategyKw", "columns"]),
  create_table_partition_of_clause: (print) =>
    print.spaced(["partitionOfKw", "table"]),
  create_table_partition_bound_clause: (print) =>
    print.spaced(["forValuesKw", "bound"]),
  partition_bound_in: (print) => print.spaced(["inKw", "values"]),
  partition_bound_from_to: (print) =>
    print.spaced(["fromKw", "from", "toKw", "to"]),
  partition_bound_minvalue: (print) => print.spaced("minvalueKw"),
  partition_bound_maxvalue: (print) => print.spaced("maxvalueKw"),
  partition_bound_with: (print) => print.spaced(["withKw", "values"]),
  partition_bound_modulus: (print) => print.spaced(["modulusKw", "value"]),
  partition_bound_remainder: (print) => print.spaced(["remainderKw", "value"]),
  create_table_default_partition_clause: (print) => print.spaced("defaultKw"),
  create_table_of_type_clause: (print) => print.spaced(["ofKw", "typeName"]),
  using_access_method_clause: (print) => print.spaced(["usingKw", "method"]),
  create_table_tablespace_clause: (print) =>
    print.spaced(["tablespaceKw", "name"]),
  with_storage_parameters_clause: (print) =>
    print.spaced(["withKw", "options"]),
  create_table_without_oids_clause: (print) => print.spaced("withoutOidsKw"),
  create_table_on_commit_clause: (print) =>
    print.spaced(["onCommitKw", "actionKw"]),
  create_table_with_data_clause: (print) => print.spaced("withDataKw"),
};

const printClauses: ToDocFn<CreateTableStmt> = (print, node) => {
  if (node.clauses.length === 1 && isAsClause(node.clauses[0])) {
    return [" ", print("clauses")];
  } else if (node.clauses.length > 0) {
    return [line, join(line, print("clauses"))];
  } else {
    return [];
  }
};
