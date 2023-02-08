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
      "tableKw",
      "ifNotExistsKw",
      "name",
      "columns",
    ]),
    printClauses(print, node, ...rest),
    node.options ? [" ", group(print("options"))] : [],
  ],
  column_definition: (print) =>
    print.spaced(["name", "dataType", "constraints"]),
  table_option: (print) => print.spaced(["name"]),
};

const printClauses: ToDocFn<CreateTableStmt> = (print, node) => {
  if (node.clauses.length === 1 && isAsClause(node.clauses[0])) {
    return [" ", print("clauses")];
  } else if (node.clauses.length > 0) {
    return group([line, join(line, print("clauses"))]);
  } else {
    return [];
  }
};
