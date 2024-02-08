import { AllIndexNodes } from "sql-parser-cst";
import { group, join } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const indexMap: Partial<CstToDocMap<AllIndexNodes>> = {
  create_index_stmt: (print) =>
    group(
      join(print.dynamicLine(), [
        print.spaced([
          "createKw",
          "orReplaceKw",
          "indexTypeKw",
          "indexKw",
          "concurrentlyKw",
          "ifNotExistsKw",
          "name",
          "onKw",
          "table",
          "using",
          "columns",
        ]),
        ...print("clauses"),
      ]),
    ),
  index_specification: (print) =>
    print.spaced(["expr", "opclass", "direction", "nullHandlingKw"]),
  index_include_clause: (print) => print.spaced(["includeKw", "columns"]),
  drop_index_stmt: (print) =>
    group(
      print.spaced([
        "dropKw",
        "indexTypeKw",
        "indexKw",
        "concurrentlyKw",
        "ifExistsKw",
        "indexes",
        "onKw",
        "table",
        "behaviorKw",
      ]),
    ),
  verbose_all_columns: (print) => print.spaced("allColumnsKw"),
  reindex_stmt: (print) => print.spaced(["reindexKw", "name"]),
};
