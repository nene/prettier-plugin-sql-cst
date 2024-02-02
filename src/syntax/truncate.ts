import { TruncateStmt } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { group, indent, line } from "../print_utils";

export const truncateMap: CstToDocMap<TruncateStmt> = {
  truncate_stmt: (print) =>
    group([
      print.spaced(["truncateKw", "tableKw"]),
      indent([
        line,
        print.separated(line, ["tables", "restartOrContinueKw", "behaviorKw"]),
      ]),
    ]),
};
