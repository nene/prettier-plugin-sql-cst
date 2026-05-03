import { AllOtherClauses } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { line, indent, group, hardline } from "../print_utils";
import { isDynamicallyLoadedFunction, isStringLiteral } from "../node_utils";

export const otherClausesMap: Partial<CstToDocMap<AllOtherClauses>> = {
  // CLUSTER BY clause
  cluster_by_clause: (print) =>
    group([print.spaced("clusterByKw"), indent([line, print("columns")])]),

  // RETURNING clause
  returning_clause: (print) =>
    group([print("returningKw"), indent([line, print("columns")])]),

  // INTO clause
  into_variables_clause: (print) =>
    group([
      print.spaced(["intoKw", "strictKw"]),
      indent([line, print("variables")]),
    ]),

  as_clause: (print, node) => {
    if (isStringLiteral(node.expr) || isDynamicallyLoadedFunction(node.expr)) {
      return group(print.spaced(["asKw", "expr"]));
    }
    return group([print("asKw"), indent([hardline, print("expr")])]);
  },

  comma_clause: (print) => group([",", indent([line, print("expr")])]),

  // WHERE CURRENT OF clause
  where_current_of_clause: (print) =>
    group(print.spaced(["whereCurrentOfKw", "cursor"])),
};
