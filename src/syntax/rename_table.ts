import { AllRenameTableNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { group, indent, line } from "../print_utils";

export const renameTableMap: CstToDocMap<AllRenameTableNodes> = {
  rename_table_stmt: (print) =>
    group([
      print.spaced(["renameKw", "tableKw"]),
      indent([line, print("actions")]),
    ]),
  rename_action: (print) => print.spaced(["from", "toKw", "to"]),
};
