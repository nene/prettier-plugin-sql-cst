import { AllVacuumNodes } from "sql-parser-cst";
import { group } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const vacuumMap: Partial<CstToDocMap<AllVacuumNodes>> = {
  vacuum_database_stmt: (print) =>
    group(print.spaced(["vacuumKw", "schema", "into"])),
  vacuum_into_clause: (print) => group(print.spaced(["intoKw", "file"])),
};
