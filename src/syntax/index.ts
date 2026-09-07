import { AllIndexNodes } from "sql-parser-cst";
import { group, join, line } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const indexMap: CstToDocMap<AllIndexNodes> = {
  create_index_stmt: (print, node) =>
    group(
      join(print.dynamicLine(), [
        group(
          join(line, [
            print.spaced([
              "createKw",
              "orReplaceKw",
              "indexTypeKw",
              "indexKw",
              "concurrentlyKw",
              "ifNotExistsKw",
              "name",
            ]),
            print.spaced([
              "onKw",
              "table",
              ...(node.using ? [] : (["columns"] as const)),
            ]),
            ...(node.using ? [print.spaced(["using", "columns"])] : []),
          ]),
        ),
        ...print("clauses"),
      ]),
    ),
  index_specification: (print) =>
    print.spaced(["expr", "opclass", "direction", "nullHandlingKw"]),
  index_include_clause: (print) => print.spaced(["includeKw", "columns"]),
  index_nulls_distinct_clause: (print) => print.spaced(["nullsDistinctKw"]),
  index_nulls_not_distinct_clause: (print) =>
    print.spaced(["nullsNotDistinctKw"]),

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

  alter_index_stmt: (print) =>
    group([
      print.spaced(["alterKw", "indexKw", "ifExistsKw", "index"]),
      print.dynamicLine(),
      print("action"),
    ]),
  alter_index_all_in_tablespace_stmt: (print) =>
    group([
      print.spaced([
        "alterIndexKw",
        "allInTablespaceKw",
        "tablespace",
        "ownedBy",
      ]),
      print.dynamicLine(),
      print("action"),
    ]),

  reindex_stmt: (print) =>
    group(
      print.spaced([
        "reindexKw",
        "options",
        "targetKw",
        "concurrentlyKw",
        "name",
      ]),
    ),
  reindex_option_concurrently: (print) =>
    print.spaced(["concurrentlyKw", "value"]),
  reindex_option_tablespace: (print) => print.spaced(["tablespaceKw", "name"]),
  reindex_option_verbose: (print) => print.spaced(["verboseKw", "value"]),
};
