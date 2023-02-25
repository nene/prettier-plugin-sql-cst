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
  // BEGIN .. END
  block_stmt: (print, node) => [
    print("beginKw"),
    indent([hardline, stripTrailingHardline(print("program"))]),
    node.exception ? [hardline, print("exception")] : [],
    hardline,
    print("endKw"),
  ],
  exception_clause: (print) => [
    print.spaced(["exceptionKw", "whenKw", "condition", "thenKw"]),
    indent([hardline, stripTrailingHardline(print("program"))]),
  ],
  error_category: (print) => print("errorKw"),

  // DECLARE
  declare_stmt: (print) =>
    join(" ", [
      print("declareKw"),
      group(print("names")),
      ...print.spaced(["dataType", "default"]),
    ]),
  declare_default: (print) => print.spaced(["defaultKw", "expr"]),

  // SET
  set_stmt: (print) => print.spaced(["setKw", "assignments"]),

  // IF
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

  // CASE
  case_stmt: (print) => [
    print.spaced(["caseKw", "expr"]),
    indent([hardline, join(hardline, print("clauses"))]),
    hardline,
    print.spaced("endCaseKw"),
  ],
};
