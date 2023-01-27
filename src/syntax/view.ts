import { AllViewStatements } from "sql-parser-cst";
import { group, hardline, indent } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const viewMap: Partial<CstToDocMap<AllViewStatements>> = {
  create_view_stmt: (print) => [
    print.spaced([
      "createKw",
      "temporaryKw",
      "viewKw",
      "ifNotExistsKw",
      "name",
      "columns",
      "asKw",
    ]),
    indent([hardline, group(print("expr"))]),
  ],
  drop_view_stmt: (print) =>
    print.spaced(["dropKw", "viewKw", "ifExistsKw", "views"]),
};
