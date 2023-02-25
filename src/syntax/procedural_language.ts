import { AllProceduralNodes } from "sql-parser-cst";
import {
  group,
  hardline,
  indent,
  join,
  line,
  stripTrailingHardline,
} from "../print_utils";
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
    group([
      print("ifKw"),
      indent([line, print("condition")]),
      line,
      print("thenKw"),
    ]),
    indent([hardline, stripTrailingHardline(print("consequent"))]),
  ],
  elseif_clause: (print) => [
    group([
      print("elseifKw"),
      indent([line, print("condition")]),
      line,
      print("thenKw"),
    ]),
    indent([hardline, stripTrailingHardline(print("consequent"))]),
  ],
  else_clause: (print) => [
    print("elseKw"),
    indent([hardline, stripTrailingHardline(print("consequent"))]),
  ],
};
