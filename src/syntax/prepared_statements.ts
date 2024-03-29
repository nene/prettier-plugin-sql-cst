import { AllPreparedStatementNodes } from "sql-parser-cst";
import { group, hardline, indent, join, line } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const preparedStatementsMap: CstToDocMap<AllPreparedStatementNodes> = {
  execute_stmt: (print) =>
    join(hardline, [
      group([
        print.spaced(["executeKw", "immediateKw"]),
        indent([line, print("expr")]),
      ]),
      ...print(["into", "using"]).map((clause) => group(clause)),
    ]),
  execute_into_clause: (print) => print.spaced(["intoKw", "variables"]),
  execute_using_clause: (print) => print.spaced(["usingKw", "values"]),
};
