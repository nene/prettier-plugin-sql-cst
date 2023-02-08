import { AllViewStatements } from "sql-parser-cst";
import { group, hardline, indent, join } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const viewMap: Partial<CstToDocMap<AllViewStatements>> = {
  create_view_stmt: (print, node) => {
    const hasOptions = node.options.length > 0;
    return [
      print.spaced([
        "createKw",
        "orReplaceKw",
        "temporaryKw",
        "materializedKw",
        "viewKw",
        "ifNotExistsKw",
        "name",
        "columns",
      ]),
      hasOptions ? [hardline, join(hardline, print("options"))] : [],
      [
        hasOptions ? hardline : " ",
        print("asKw"),
        indent([hardline, group(print("expr"))]),
      ],
    ];
  },
  drop_view_stmt: (print) =>
    print.spaced(["dropKw", "materializedKw", "viewKw", "ifExistsKw", "views"]),
};
