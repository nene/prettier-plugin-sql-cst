import { AllFrameNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { hardline } from "../print_utils";

export const frameMap: CstToDocMap<AllFrameNodes> = {
  frame_clause: (print, node) => [
    print.spaced(["unitKw", "extent"]),
    node.exclusion ? [hardline, print("exclusion")] : [],
  ],
  frame_bound_current_row: (print) => print.spaced("currentRowKw"),
  frame_bound_preceding: (print) => print.spaced(["expr", "precedingKw"]),
  frame_bound_following: (print) => print.spaced(["expr", "followingKw"]),
  frame_unbounded: (print) => print.spaced("unboundedKw"),
  frame_between: (print) =>
    print.spaced(["betweenKw", "begin", "andKw", "end"]),
  frame_exclusion: (print) => print.spaced(["excludeKw", "kindKw"]),
};
