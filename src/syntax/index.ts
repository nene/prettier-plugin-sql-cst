import { AllIndexNodes } from "sql-parser-cst";
import { hardline, join } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const indexMap: Partial<CstToDocMap<AllIndexNodes>> = {
  create_index_stmt: (print, node) =>
    join(hardline, [
      print.spaced([
        "createKw",
        "indexTypeKw",
        "indexKw",
        "ifNotExistsKw",
        "name",
        "onKw",
        "table",
        "columns",
      ]),
      ...(node.clauses.length > 0 ? [join(hardline, print("clauses"))] : []),
    ]),
  drop_index_stmt: (print) =>
    print.spaced(["dropKw", "indexKw", "ifExistsKw", "indexes"]),
};
