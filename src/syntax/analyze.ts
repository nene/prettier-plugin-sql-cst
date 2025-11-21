import { AnalyzeStmt } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { group } from "../print_utils";

export const analyzeMap: CstToDocMap<AnalyzeStmt> = {
  analyze_stmt: (print) =>
    group(print.spaced(["analyzeKw", "tableKw", "tables"])),
};
