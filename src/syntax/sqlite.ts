import { AllSqliteNodes } from "sql-parser-cst";
import { hardline, join } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const sqliteMap: CstToDocMap<AllSqliteNodes> = {
  attach_database_stmt: (print) =>
    print.spaced(["attachKw", "databaseKw", "file", "asKw", "schema"]),
  detach_database_stmt: (print) =>
    print.spaced(["detachKw", "databaseKw", "schema"]),
  vacuum_stmt: (print) =>
    print.spaced(["vacuumKw", "schema", "intoKw", "file"]),
  reindex_stmt: (print) => print.spaced(["reindexKw", "table"]),
  pragma_stmt: (print) => print.spaced(["pragmaKw", "pragma"]),
  pragma_assignment: (print) => join(" = ", print(["name", "value"])),
  pragma_func_call: (print) => print(["name", "args"]),
};
