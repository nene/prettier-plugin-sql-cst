import { AllTriggerNodes } from "sql-parser-cst";
import { group, hardline, indent, join, line } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const triggerMap: CstToDocMap<AllTriggerNodes> = {
  create_trigger_stmt: (print, node) =>
    join(hardline, [
      print.spaced([
        "createKw",
        "orReplaceKw",
        "kind",
        "triggerKw",
        "ifNotExistsKw",
        "name",
      ]),
      group([
        node.timeKw ? [print.spaced("timeKw"), " "] : [],
        print("event"),
        line,
        print("target"),
      ]),
      ...print("clauses"),
      print("body"),
    ]),
  trigger_event: (print, node) =>
    group([
      print.spaced(["eventKw", "ofKw"]),
      node.columns ? indent([line, print("columns")]) : [],
    ]),
  trigger_target: (print) => print.spaced(["onKw", "table"]),
  when_clause: (print) =>
    group([print("whenKw"), indent([line, print("expr")])]),
  for_each_clause: (print) => print.spaced(["forEachKw", "itemKw"]),
  execute_clause: (print) => [
    print.spaced(["executeKw", "functionKw", "name"]),
    print("args"),
  ],
  from_referenced_table_clause: (print) => print.spaced(["fromKw", "table"]),
  trigger_timing_clause: (print) => print.spaced(["timingKw"]),
  trigger_referencing_clause: (print) =>
    group([
      print.spaced(["referencingKw"]),
      indent([line, print("transitions")]),
    ]),
  trigger_transition: (print) => [
    print.spaced(["oldOrNewKw", "rowOrTableKw", "asKw", "name"]),
  ],

  alter_trigger_stmt: (print) =>
    group(
      join(print.dynamicLine(), [
        print.spaced(["alterTriggerKw", "trigger", "target"]),
        print("action"),
      ]),
    ),

  drop_trigger_stmt: (print) =>
    print.spaced(["dropTriggerKw", "ifExistsKw", "trigger", "behaviorKw"]),
};
