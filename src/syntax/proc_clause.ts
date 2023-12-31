import { AllProcClauseNodes } from "sql-parser-cst";
import { isStringLiteral } from "../node_utils";
import { CstToDocMap } from "../CstToDocMap";
import { hardline, indent } from "../print_utils";

export const procClauseMap: CstToDocMap<AllProcClauseNodes> = {
  returns_clause: (print) => print.spaced(["returnsKw", "dataType"]),
  determinism_clause: (print) => print.spaced("deterministicKw"),
  language_clause: (print) => print.spaced(["languageKw", "name"]),
  as_clause: (print, node) => {
    if (isStringLiteral(node.expr)) {
      return print.spaced(["asKw", "expr"]);
    }
    return [print("asKw"), indent([hardline, print("expr")])];
  },
  with_connection_clause: (print) =>
    print.spaced(["withConnectionKw", "connection"]),
};
