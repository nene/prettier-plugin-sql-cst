import { AllCreateTableNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { group } from "../print_utils";

export const createTableMap: Partial<CstToDocMap<AllCreateTableNodes>> = {
  create_table_stmt: (print, node) => [
    print.spaced([
      "createKw",
      "temporaryKw",
      "tableKw",
      "ifNotExistsKw",
      "name",
      "columns",
      "clauses",
    ]),
    node.options ? [" ", group(print("options"))] : [],
  ],
  column_definition: (print) =>
    print.spaced(["name", "dataType", "constraints"]),
  table_option: (print) => print.spaced(["name"]),
};
