import { AllCreateTableNodes, CreateTableStmt } from "sql-parser-cst";
import { isAsClause } from "../node_utils";
import { CstToDocMap, ToDocFn } from "../CstToDocMap";
import { group, join, line } from "../print_utils";

export const createTableMap: CstToDocMap<AllCreateTableNodes> = {
  create_table_stmt: (print, node, ...rest) => [
    print.spaced([
      "createKw",
      "orReplaceKw",
      "temporaryKw",
      "externalKw",
      "snapshotKw",
      "virtualKw",
      "tableKw",
      "ifNotExistsKw",
      "name",
      "columns",
    ]),
    printClauses(print, node, ...rest),
    node.options ? [line, group(print("options"))] : [],
  ],
  column_definition: (print) =>
    print.spaced(["name", "dataType", "constraints"]),
  table_option: (print, node) => {
    if (node.value && node.hasEq) {
      return [print.spaced("name"), " = ", print.spaced("value")];
    } else if (node.value) {
      return [print.spaced("name"), " ", print.spaced("value")];
    } else {
      return print.spaced("name");
    }
  },
  create_table_like_clause: (print) => print.spaced(["likeKw", "name"]),
  create_table_copy_clause: (print) => print.spaced(["copyKw", "name"]),
  create_table_clone_clause: (print) => print.spaced(["cloneKw", "table"]),
  with_partition_columns_clause: (print) =>
    print.spaced(["withPartitionColumnsKw", "columns"]),
  create_table_using_clause: (print) => print.spaced(["usingKw", "module"]),
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
