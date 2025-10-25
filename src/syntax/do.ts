import { DoStmt } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";

export const doMap: CstToDocMap<DoStmt> = {
  do_stmt: (print) => print.spaced(["doKw", "language", "body"]),
};
