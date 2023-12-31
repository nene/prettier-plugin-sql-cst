import { AllProcedureNodes } from "sql-parser-cst";
import { group, hardline, join } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const procedureMap: CstToDocMap<AllProcedureNodes> = {
  create_procedure_stmt: (print, node) => [
    print.spaced([
      "createKw",
      "orReplaceKw",
      "procedureKw",
      "ifNotExistsKw",
      "name",
    ]),
    print("params"),
    hardline,
    join(
      hardline,
      print("clauses").map((clause) => group(clause)),
    ),
  ],
  procedure_param: (print) => print.spaced(["mode", "name", "dataType"]),
  drop_procedure_stmt: (print) =>
    print.spaced(["dropKw", "procedureKw", "ifExistsKw", "name"]),
};
