import { AllCreateTableNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { join } from "../print_utils";

export const createTableMap: Partial<CstToDocMap<AllCreateTableNodes>> = {
  create_table_stmt: (print) =>
    join(" ", print(["createKw", "tableKw", "name", "columns"])),
  column_definition: (print) =>
    join(" ", [...print(["name", "dataType"]), ...print("constraints")]),
};
