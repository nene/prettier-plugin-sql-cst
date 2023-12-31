import { AllIndexNodes } from "sql-parser-cst";
import { hardline, join } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const indexMap: CstToDocMap<AllIndexNodes> = {
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
    print.spaced([
      "dropKw",
      "indexTypeKw",
      "indexKw",
      "ifExistsKw",
      "indexes",
      "onKw",
      "table",
    ]),
  verbose_all_columns: (print) => print.spaced("allColumnsKw"),
};
