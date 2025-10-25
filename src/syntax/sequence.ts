import { AllSequenceNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { group, indent, join, line } from "../print_utils";

export const sequenceMap: Partial<CstToDocMap<AllSequenceNodes>> = {
  create_sequence_stmt: (print, node) =>
    group([
      print.spaced(["createKw", "kind", "sequenceKw", "ifNotExistsKw", "name"]),
      node.options.length > 0
        ? indent([print.dynamicLine(), join(line, print("options"))])
        : [],
    ]),
  alter_sequence_stmt: (print) =>
    group([
      print.spaced(["alterKw", "sequenceKw", "ifExistsKw", "sequence"]),
      indent([print.dynamicLine(), join(line, print("actions"))]),
    ]),
  drop_sequence_stmt: (print) =>
    group(
      print.spaced([
        "dropKw",
        "sequenceKw",
        "ifExistsKw",
        "sequences",
        "behaviorKw",
      ]),
    ),

  sequence_option_as_type: (print) => print.spaced(["asKw", "dataType"]),
  sequence_option_increment: (print) =>
    print.spaced(["incrementKw", "byKw", "value"]),
  sequence_option_minvalue: (print) => print.spaced(["minvalueKw", "value"]),
  sequence_option_maxvalue: (print) => print.spaced(["maxvalueKw", "value"]),
  sequence_option_no_minvalue: (print) => print.spaced("noMinvalueKw"),
  sequence_option_no_maxvalue: (print) => print.spaced("noMaxvalueKw"),
  sequence_option_start: (print) =>
    print.spaced(["startKw", "withKw", "value"]),
  sequence_option_restart: (print) =>
    print.spaced(["restartKw", "withKw", "value"]),
  sequence_option_cache: (print) => print.spaced(["cacheKw", "value"]),
  sequence_option_cycle: (print) => print.spaced("cycleKw"),
  sequence_option_no_cycle: (print) => print.spaced("noCycleKw"),
  sequence_option_owned_by: (print) => print.spaced(["ownedByKw", "owner"]),

  sequence_option_list: (print) => join(line, print("options")),
};
