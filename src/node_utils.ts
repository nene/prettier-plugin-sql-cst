import { Node } from "sql-parser-cst";
import { NodeByType } from "./CstToDocMap";

const is =
  <TType extends Node["type"]>(type: TType) =>
  (node?: Node): node is NodeByType<TType, Node> =>
    node?.type === type;

export const isValuesClause = is("values_clause");
export const isFuncCall = is("func_call");
export const isCreateTableStmt = is("create_table_stmt");
