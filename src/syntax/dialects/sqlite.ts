import { AllSqliteNodes } from "sql-parser-cst";
import { group, join } from "../../print_utils";
import { CstToDocMap } from "../../CstToDocMap";

export const sqliteMap: CstToDocMap<AllSqliteNodes> = {
  attach_database_stmt: (print) =>
    group(print.spaced(["attachKw", "databaseKw", "file", "asKw", "schema"])),
  detach_database_stmt: (print) =>
    group(print.spaced(["detachKw", "databaseKw", "schema"])),
  vacuum_stmt: (print) =>
    group(print.spaced(["vacuumKw", "schema", "intoKw", "file"])),
  pragma_stmt: (print) => group(print.spaced(["pragmaKw", "pragma"])),
  pragma_assignment: (print) => join(" = ", print(["name", "value"])),
  pragma_func_call: (print) => print(["name", "args"]),
};
