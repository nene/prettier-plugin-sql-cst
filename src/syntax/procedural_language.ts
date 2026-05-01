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
  // labels
  labeled_stmt: (print, node) =>
    group([
      print.spaced(["beginLabel", "statement"]),
      node.endLabel ? [" ", print(["endLabel"])] : [],
    ]),
  colon_label: (print) => [print("label"), ":"],
  chevron_label: (print) => ["<<", print("label"), ">>"],

  // BEGIN .. END
  block_stmt: (print, node) =>
    group([
      stripTrailingHardline(print("declareClause")),
      [
        node.declareClause ? hardline : [],
        print.spaced(["beginKw", "atomicKw"]),
      ],
      node.program.statements.length > 0
        ? indent([hardline, stripTrailingHardline(print("program"))])
        : print("program"),
      node.exception ? [hardline, print("exception")] : [],
      hardline,
      print("endKw"),
    ]),

  // DECLARE
  declare_clause: (print, node) =>
    group([print("declareKw"), indent([hardline, print("program")])]),
  declare_stmt: (print) =>
    group(
      join(" ", [
        ...print.spaced(["declareKw"]),
        group(print("names")),
        ...print.spaced(["constantKw", "dataType", "constraints", "init"]),
      ]),
    ),
  declare_init: (print) => print.spaced(["operator", "expr"]),

  // EXCEPTION
  exception_clause: (print, node) => {
    if (node.clauses.length === 1) {
      // Keep single exception clause on the same line as EXCEPTION keyword
      return group(print.spaced(["exceptionKw", "clauses"]));
    } else {
      return group([
        print("exceptionKw"),
        indent([
          hardline,
          stripTrailingHardline(print("clauses").map((doc) => [doc, hardline])),
        ]),
      ]);
    }
  },
  exception_when_clause: (print, node) =>
    group([
      join(" ", [print("whenKw"), group(print("condition")), print("thenKw")]),
      node.program.statements.length > 0
        ? indent([hardline, stripTrailingHardline(print("program"))])
        : print("program"),
    ]),

  error_bigquery: (print) => print("errorKw"),
  error_name: (print) => print("name"),
  error_sqlstate: (print) => print.spaced(["sqlstateKw", "code"]),

  // SET
  set_stmt: (print) => group(print.spaced(["setKw", "assignments"])),

  // assignment
  assignment_stmt: (print) =>
    group(print.spaced(["target", "operator", "expr"])),

  // IF
  if_stmt: (print) =>
    group(join(hardline, [...print("clauses"), print.spaced("endIfKw")])),
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
  case_stmt: (print) =>
    group([
      print.spaced(["caseKw", "expr"]),
      indent([hardline, join(hardline, print("clauses"))]),
      hardline,
      print.spaced("endCaseKw"),
    ]),

  // LOOP
  loop_stmt: (print) =>
    group([
      print("loopKw"),
      indent([hardline, stripTrailingHardline(print("body"))]),
      hardline,
      print.spaced("endLoopKw"),
    ]),
  // REPEAT
  repeat_stmt: (print) =>
    group([
      print("repeatKw"),
      indent([hardline, stripTrailingHardline(print("body"))]),
      hardline,
      print.spaced(["untilKw", "condition", "endRepeatKw"]),
    ]),
  // WHILE
  while_stmt: (print) =>
    group([
      print.spaced(["whileKw", "condition", "doKw"]),
      indent([hardline, stripTrailingHardline(print("body"))]),
      hardline,
      print.spaced("endWhileKw"),
    ]),
  // FOR .. IN
  for_stmt: (print) =>
    group([
      print.spaced(["forKw", "left", "inKw", "right", "doKw"]),
      indent([hardline, stripTrailingHardline(print("body"))]),
      hardline,
      print.spaced("endForKw"),
    ]),
  // BREAK/CONTINUE
  break_stmt: (print) => group(print.spaced(["breakKw", "label", "when"])),
  continue_stmt: (print) =>
    group(print.spaced(["continueKw", "label", "when"])),

  // CALL
  call_stmt: (print) => group(print.spaced(["callKw", "func"])),
  // RETURN
  return_stmt: (print) => group(print.spaced(["returnKw", "expr"])),
  return_next_stmt: (print) => group(print.spaced(["returnNextKw", "expr"])),
  return_query_stmt: (print) =>
    group([print.spaced("returnQueryKw"), " ", indent(print("expr"))]),
  // RAISE
  raise_stmt: (print) => group(print.spaced(["raiseKw", "using"])),
  raise_using_clause: (print) => group(print.spaced(["usingKw", "options"])),
  raise_option_element: (print) => [print("nameKw"), " = ", print("value")],
  // ASSERT
  assert_stmt: (print) =>
    group(print.spaced(["assertKw", "condition", "message"])),
  // NULL
  null_stmt: (print) => group(print.spaced(["nullKw"])),
};
