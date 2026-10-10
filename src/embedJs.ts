import { Printer } from "prettier";
import { Node } from "sql-parser-cst";
import {
  isAsClause,
  isCreateFunctionStmt,
  isStringLiteral,
} from "./node_utils";
import { isJavaScriptLanguageClause } from "./languageClause";
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
