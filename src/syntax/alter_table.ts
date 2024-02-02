import { AllAlterTableNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { group, indent, line } from "../print_utils";

export const alterTableMap: CstToDocMap<AllAlterTableNodes> = {
  alter_table_stmt: (print) =>
    group([
      print.spaced(["alterTableKw", "ifExistsKw", "table"]),
      print.dynamicLine(),
      print("actions"),
    ]),
  alter_table_all_in_tablespace_stmt: (print) =>
    group([
      print.spaced([
        "alterTableKw",
        "allInTablespaceKw",
        "tablespace",
        "ownedBy",
      ]),
      print.dynamicLine(),
      print("action"),
    ]),
  owned_by_clause: (print) =>
    group([print.spaced("ownedByKw"), indent([line, print("owners")])]),
};
