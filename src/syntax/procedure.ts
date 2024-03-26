import { AllProcedureNodes } from "sql-parser-cst";
import { group, hardline, join } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const procedureMap: Partial<CstToDocMap<AllProcedureNodes>> = {
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
  drop_procedure_stmt: (print) =>
    group([
      print.spaced(["dropKw", "procedureKw", "ifExistsKw", "name"]),
      print.spaced(["params", "behaviorKw"]),
    ]),
};
