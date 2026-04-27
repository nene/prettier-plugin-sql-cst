import { AllProcClauseNodes } from "sql-parser-cst";
import { isDynamicallyLoadedFunction, isStringLiteral } from "../node_utils";
import { CstToDocMap } from "../CstToDocMap";
import { hardline, indent } from "../print_utils";

export const procClauseMap: CstToDocMap<AllProcClauseNodes> = {
  returns_clause: (print) => print.spaced(["returnsKw", "dataType"]),
  determinism_clause: (print) => print.spaced("deterministicKw"),
  language_clause: (print) => print.spaced(["languageKw", "name"]),
  with_connection_clause: (print) =>
    print.spaced(["withConnectionKw", "connection"]),
};
