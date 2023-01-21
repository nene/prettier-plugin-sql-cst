import { AllCreateTableNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";

export const createTableMap: Partial<CstToDocMap<AllCreateTableNodes>> = {
  create_table_stmt: (print) =>
    print.spaced([
      "createKw",
      "temporaryKw",
      "tableKw",
      "ifNotExistsKw",
      "name",
      "columns",
    ]),
  column_definition: (print) =>
    print.spaced(["name", "dataType", "constraints"]),
};
