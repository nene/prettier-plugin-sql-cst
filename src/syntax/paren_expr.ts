import { Node, ParenExpr } from "sql-parser-cst";
import {
  isCompoundSelectStmt,
  isFuncArgs,
  isListExpr,
  isParenExpr,
  isSelectStmt,
} from "../node_utils";

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

export const isParenExprNecessary = (
  node: ParenExpr<Node>,
  parent: Node | null,
  grandParent: Node | null,
) => {
  // nested ((parentheses)) aren't necessary
  // except around (SELECT ...)
  if (
    isParenExpr(node.expr) &&
    !isSelectStmt(node.expr.expr) &&
    !isCompoundSelectStmt(node.expr.expr)
  ) {
    return false;
  }
  // Parenthesis around function arguments aren't necessary
  if (
    isListExpr(parent) &&
    isFuncArgs(grandParent) &&
    // TODO: We really should parse the DISTINCT (...) expression as a separate thing.
    // For now this check here patches up the deficiency in the parser.
    !grandParent.distinctKw &&
    !isSelectStmt(node.expr) &&
    !isCompoundSelectStmt(node.expr)
  ) {
    return false;
  }
  return true;
};

const hasComments = (node: Node): boolean =>
  (node.leading?.length ?? 0) > 0 || (node.trailing?.length ?? 0) > 0;
