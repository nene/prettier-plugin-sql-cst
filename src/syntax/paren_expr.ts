import { Node, ParenExpr } from "sql-parser-cst";
import { isFuncArgs, isListExpr } from "../node_utils";

export const isEmptyParenExpr = (node: ParenExpr): boolean => {
  if (hasComments(node) || hasComments(node.expr)) {
    return false;
  }
  if (isFuncArgs(node.expr)) {
    return (
      node.expr.args.items.length === 0 &&
      !node.expr.distinctKw &&
      !node.expr.nullHandlingKw &&
      !node.expr.orderBy &&
      !node.expr.limit &&
      !node.expr.having
    );
  }
  if (isListExpr(node.expr)) {
    return node.expr.items.length === 0;
  }
  return false;
};

const hasComments = (node: Node): boolean =>
  (node.leading?.length ?? 0) > 0 || (node.trailing?.length ?? 0) > 0;
