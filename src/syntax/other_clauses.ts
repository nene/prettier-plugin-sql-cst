import { AllOtherClauses } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { line, indent, group } from "../print_utils";

export const otherClausesMap: CstToDocMap<AllOtherClauses> = {
  // CLUSTER BY clause
  cluster_by_clause: (print) =>
    group([print.spaced("clusterByKw"), indent([line, print("columns")])]),

  // RETURNING clause
  returning_clause: (print) =>
    group([print("returningKw"), indent([line, print("columns")])]),

  // WHERE CURRENT OF clause
  where_current_of_clause: (print) =>
    print.spaced(["whereCurrentOfKw", "cursor"]),
};
