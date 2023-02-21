import { AnalyzeStmt } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";

export const analyzeMap: CstToDocMap<AnalyzeStmt> = {
  analyze_stmt: (print) => print.spaced(["analyzeKw", "tableKw", "tables"]),
};
