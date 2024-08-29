import { Node } from "sql-parser-cst";
import { isObject } from "./utils";
import { NodeByType } from "./CstToDocMap";

const is =
  <TType extends Node["type"]>(type: TType) =>
  (node: any): node is NodeByType<TType, Node> =>
    isObject(node) && node.type === type;

export const isProgram = is("program");
export const isValuesClause = is("values_clause");
export const isFuncCall = is("func_call");
export const isFuncArgs = is("func_args");
export const isCreateTableStmt = is("create_table_stmt");
export const isKeyword = is("keyword");
export const isEmpty = is("empty");
export const isJsonLiteral = is("json_literal");
export const isJsonbLiteral = is("jsonb_literal");
export const isStringLiteral = is("string_literal");
export const isArraySubscript = is("array_subscript");
export const isAsClause = is("as_clause");
export const isParenExpr = is("paren_expr");
export const isSelectStmt = is("select_stmt");
export const isCompoundSelectStmt = is("compound_select_stmt");
export const isListExpr = is("list_expr");
export const isCreateFunctionStmt = is("create_function_stmt");
export const isLanguageClause = is("language_clause");
export const isDynamicallyLoadedFunction = is("dynamically_loaded_function");
