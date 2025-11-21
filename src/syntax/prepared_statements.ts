import { AllPreparedStatementNodes } from "sql-parser-cst";
import { group, hardline, indent, join, line } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const preparedStatementsMap: CstToDocMap<AllPreparedStatementNodes> = {
  // EXECUTE
  execute_stmt: (print, node) => {
    if (node.args?.type === "execute_using_clause") {
      return group(print.spaced(["executeKw", "name", "args"]));
    } else {
      return group([print.spaced(["executeKw", "name"]), print("args")]);
    }
  },
  execute_immediate_stmt: (print) =>
    group(
      join(hardline, [
        group([
          print.spaced(["executeKw", "immediateKw"]),
          indent([line, print("expr")]),
        ]),
        ...print(["into", "using"]).map((clause) => group(clause)),
      ]),
    ),
  execute_into_clause: (print) => print.spaced(["intoKw", "variables"]),
  execute_using_clause: (print) =>
    group([print("usingKw"), indent([line, print("values")])]),

  // PREPARE
  prepare_stmt: (print) =>
    group(
      join(" ", [
        print("prepareKw"),
        print(["name", "params"]),
        print("source"),
      ]),
    ),
  prepare_from_clause: (print) =>
    group([print("fromKw"), indent([line, print("expr")])]),

  // DEALLOCATE
  deallocate_stmt: (print) => group(print.spaced(["deallocateKw", "name"])),
  deallocate_all: (print) => print("allKw"),
};
