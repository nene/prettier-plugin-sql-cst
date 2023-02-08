import { AllCreateTableNodes, CreateTableStmt, Node } from "sql-parser-cst";
import { isAsClause } from "../node_utils";
import { CstToDocMap, ToDocFn } from "../CstToDocMap";
import { group, join, line } from "../print_utils";

export const createTableMap: Partial<CstToDocMap<AllCreateTableNodes>> = {
  create_table_stmt: (print, node, ...rest) => [
    print.spaced([
      "createKw",
      "orReplaceKw",
      "temporaryKw",
      "snapshotKw",
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
  table_option: (print) => print.spaced(["name"]),
  create_table_like_clause: (print) => print.spaced(["likeKw", "name"]),
  create_table_copy_clause: (print) => print.spaced(["copyKw", "name"]),
  create_table_clone_clause: (print) => print.spaced(["cloneKw", "name"]),
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
