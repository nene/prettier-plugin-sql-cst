import { AllOtherClauses } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { line, indent, group, hardline } from "../print_utils";
import { isDynamicallyLoadedFunction, isStringLiteral } from "../node_utils";

export const otherClausesMap: CstToDocMap<AllOtherClauses> = {
  // CLUSTER BY clause
  cluster_by_clause: (print) =>
    group([print.spaced("clusterByKw"), indent([line, print("columns")])]),

  // RETURNING clause
  returning_clause: (print) =>
    group([print("returningKw"), indent([line, print("columns")])]),

  as_clause: (print, node) => {
    if (isStringLiteral(node.expr) || isDynamicallyLoadedFunction(node.expr)) {
      return print.spaced(["asKw", "expr"]);
    }
    return [print("asKw"), indent([hardline, print("expr")])];
  },

  // WHERE CURRENT OF clause
  where_current_of_clause: (print) =>
    print.spaced(["whereCurrentOfKw", "cursor"]),
};
