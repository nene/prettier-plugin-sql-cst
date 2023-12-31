import { AllTriggerNodes } from "sql-parser-cst";
import { group, hardline, indent, join, line } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const triggerMap: CstToDocMap<AllTriggerNodes> = {
  create_trigger_stmt: (print, node) =>
    join(hardline, [
      print.spaced([
        "createKw",
        "temporaryKw",
        "triggerKw",
        "ifNotExistsKw",
        "name",
      ]),
      print("event"),
      ...(node.forEachRowKw ? [print.spaced(["forEachRowKw"])] : []),
      ...(node.condition ? [print(["condition"])] : []),
      print("body"),
    ]),
  trigger_event: (print) =>
    group([
      print.spaced(["timeKw", "eventKw", "ofKw"]),
      indent([
        line,
        join(line, [...print(["columns"]), print.spaced(["onKw", "table"])]),
      ]),
    ]),
  trigger_condition: (print) =>
    group([print("whenKw"), indent([line, print("expr")])]),
  drop_trigger_stmt: (print) =>
    print.spaced(["dropTriggerKw", "ifExistsKw", "trigger"]),
};
