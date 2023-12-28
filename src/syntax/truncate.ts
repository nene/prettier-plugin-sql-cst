import { TruncateStmt } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";

export const truncateMap: CstToDocMap<TruncateStmt> = {
  truncate_stmt: (print) => print.spaced(["truncateKw", "tableKw", "table"]),
};
