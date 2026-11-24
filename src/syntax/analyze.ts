import { AllAnalyzeNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { group } from "../print_utils";

export const analyzeMap: CstToDocMap<AllAnalyzeNodes> = {
  analyze_stmt: (print) =>
    group(print.spaced(["analyzeKw", "tableKw", "tables"])),
};
