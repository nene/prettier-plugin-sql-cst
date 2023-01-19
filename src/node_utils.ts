import { Node } from "sql-parser-cst";

export const isValuesClause = (node?: Node) => node?.type === "values_clause";
export const isFuncCall = (node?: Node) => node?.type === "func_call";
export const isCreateTableStmt = (node?: Node) =>
  node?.type === "create_table_stmt";
