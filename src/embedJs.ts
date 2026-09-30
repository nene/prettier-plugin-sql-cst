import { Printer } from "prettier";
import { CreateFunctionStmt, Node } from "sql-parser-cst";
import {
  isAsClause,
  isCreateFunctionStmt,
  isLanguageClause,
  isStringLiteral,
} from "./node_utils";
import { formatBigqueryString } from "./formatBigqueryString";

export const embedJs: NonNullable<Printer<Node>["embed"]> = (path, options) => {
  const node = path.node;
  const parent = path.getParentNode(0);
  const grandParent = path.getParentNode(1);
  if (
    isStringLiteral(node) &&
    isAsClause(parent) &&
    isCreateFunctionStmt(grandParent) &&
    grandParent.clauses.some(isJavaScriptLanguageClause)
  ) {
    return formatBigqueryString(node, {
      ...options,
      parser: "babel",
    });
  }
  return null;
};

const isJavaScriptLanguageClause = (
  clause: CreateFunctionStmt["clauses"][0],
): boolean => isLanguageClause(clause) && clause.name.name === "js";
