import { AllProcedureNodes } from "sql-parser-cst";
import { group, hardline, join } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";
import { hasOnlyAsClause } from "./function";

export const procedureMap: CstToDocMap<AllProcedureNodes> = {
  create_procedure_stmt: (print, node) =>
    group([
      print.spaced([
        "createKw",
        "orReplaceKw",
        "procedureKw",
        "ifNotExistsKw",
        "name",
      ]),
      print("params"),
      hasOnlyAsClause(node)
        ? [" ", group(print("clauses"))]
        : [
            hardline,
            join(
              hardline,
              print("clauses").map((clause) => group(clause)),
            ),
          ],
    ]),
  drop_procedure_stmt: (print) =>
    group([
      print.spaced(["dropKw", "procedureKw", "ifExistsKw", "name"]),
      print.spaced(["params", "behaviorKw"]),
    ]),

  // almost exact copy of alter_function_stmt
  alter_procedure_stmt: (print, node) =>
    group([
      print.spaced(["alterKw", "procedureKw"]),
      " ",
      print(["name", "params"]),
      print.dynamicLine(),
      join(print.dynamicLine(), print("actions")),
      node.behaviorKw ? [print.dynamicLine(), print("behaviorKw")] : [],
    ]),
};
