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

  // LOOP
  loop_stmt: (print) => [
    print("loopKw"),
    indent([hardline, stripTrailingHardline(print("body"))]),
    hardline,
    print.spaced("endLoopKw"),
  ],
  // REPEAT
  repeat_stmt: (print) => [
    print("repeatKw"),
    indent([hardline, stripTrailingHardline(print("body"))]),
    hardline,
    print.spaced(["untilKw", "condition", "endRepeatKw"]),
  ],
  // WHILE
  while_stmt: (print) => [
    print.spaced(["whileKw", "condition", "doKw"]),
    indent([hardline, stripTrailingHardline(print("body"))]),
    hardline,
    print.spaced("endWhileKw"),
  ],
  // FOR .. IN
  for_stmt: (print) => [
    print.spaced(["forKw", "left", "inKw", "right", "doKw"]),
    indent([hardline, stripTrailingHardline(print("body"))]),
    hardline,
    print.spaced("endForKw"),
  ],
  // BREAK/CONTINUE
  break_stmt: (print) => print.spaced(["breakKw", "label"]),
  continue_stmt: (print) => print.spaced(["continueKw", "label"]),
  labeled_stmt: (print, node) => [
    print("beginLabel"),
    ": ",
    print("statement"),
    node.endLabel ? [" ", print(["endLabel"])] : [],
  ],
  // CALL
  call_stmt: (print) => print.spaced(["callKw", "func"]),
  // RETURN
  return_stmt: (print) => print("returnKw"),
};
