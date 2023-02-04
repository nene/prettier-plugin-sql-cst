import { Node } from "sql-parser-cst";
import { isObject } from "./utils";
import { NodeByType } from "./CstToDocMap";

const is =
  <TType extends Node["type"]>(type: TType) =>
  (node: any): node is NodeByType<TType, Node> =>
    isObject(node) && node.type === type;

export const isValuesClause = is("values_clause");
export const isFuncCall = is("func_call");
export const isCreateTableStmt = is("create_table_stmt");
export const isKeyword = is("keyword");
export const isEmpty = is("empty");
export const isJsonLiteral = is("json_literal");
export const isStringLiteral = is("string_literal");
