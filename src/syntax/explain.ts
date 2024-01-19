import { ExplainStmt } from "sql-parser-cst";
import { group, indent, line } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const explainMap: CstToDocMap<ExplainStmt> = {
  explain_stmt: (print) =>
    group([
      print.spaced(["explainKw", "analyzeKw", "queryPlanKw"]),
      indent([line, print("statement")]),
    ]),
};
