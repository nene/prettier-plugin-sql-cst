import { DeleteStmt } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { hardline, join } from "../print_utils";

export const deleteMap: CstToDocMap<DeleteStmt> = {
  // TODO: change DeleteStmt node to use list of clauses
  delete_stmt: (print) =>
    join(hardline, [
      ...print(["with"]),
      print.spaced(["deleteKw", "fromKw", "table"]),
      ...print(["where", "returning"]),
    ]),
};
