import { TruncateStmt } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { group, indent, join, line } from "../print_utils";
import { isDefined } from "../utils";

export const truncateMap: CstToDocMap<TruncateStmt> = {
  truncate_stmt: (print, node) => [
    print.spaced(["truncateKw", "tableKw"]),
    group(
      indent([
        line,
        join(
          line,
          [
            print("tables"),
            node.restartOrContinueKw
              ? print.spaced("restartOrContinueKw")
              : undefined,
            node.cascadeOrRestrictKw ? print("cascadeOrRestrictKw") : undefined,
          ].filter(isDefined),
        ),
      ]),
    ),
  ],
};
