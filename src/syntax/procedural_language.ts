import { AllProceduralNodes } from "sql-parser-cst";
import { hardline, indent, join, stripTrailingHardline } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const proceduralLanguageMap: Partial<CstToDocMap<AllProceduralNodes>> = {
  block_stmt: (print) => [
    print("beginKw"),
    indent([hardline, stripTrailingHardline(print("program"))]),
    hardline,
    print("endKw"),
  ],
  if_stmt: (print) =>
    join(hardline, [...print("clauses"), print.spaced("endIfKw")]),
  if_clause: (print) => [
    print.spaced(["ifKw", "condition", "thenKw"]),
    indent([hardline, stripTrailingHardline(print("consequent"))]),
  ],
  elseif_clause: (print) => [
    print.spaced(["elseifKw", "condition", "thenKw"]),
    indent([hardline, stripTrailingHardline(print("consequent"))]),
  ],
  else_clause: (print) => [
    print("elseKw"),
    indent([hardline, stripTrailingHardline(print("consequent"))]),
  ],
};
