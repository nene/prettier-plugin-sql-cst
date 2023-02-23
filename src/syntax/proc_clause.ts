import { AllProcClauseNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { group, hardline, indent } from "../print_utils";

export const procClauseMap: Partial<CstToDocMap<AllProcClauseNodes>> = {
  returns_clause: (print) => print.spaced(["returnsKw", "dataType"]),
  determinism_clause: (print) => print.spaced("deterministicKw"),
  language_clause: (print) => print.spaced(["languageKw", "name"]),
  as_clause: (print) => [print("asKw"), indent([hardline, print("expr")])],
  with_connection_clause: (print) =>
    print.spaced(["withConnectionKw", "connection"]),
};
