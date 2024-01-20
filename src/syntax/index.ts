import { AllIndexNodes } from "sql-parser-cst";
import { group, join } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const indexMap: CstToDocMap<AllIndexNodes> = {
  create_index_stmt: (print) =>
    group(
      join(print.dynamicLine(), [
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
        ...print("clauses"),
      ]),
    ),
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
