import { DoStmt } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { group } from "../print_utils";

export const doMap: CstToDocMap<DoStmt> = {
  do_stmt: (print) => group(print.spaced(["doKw", "language", "body"])),
};
