import { AllAlterTableNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { group } from "../print_utils";

export const alterTableMap: Partial<CstToDocMap<AllAlterTableNodes>> = {
  alter_table_stmt: (print) =>
    group([
      print.spaced(["alterTableKw", "ifExistsKw", "table"]),
      print.dynamicLine(),
      print("actions"),
    ]),
};
