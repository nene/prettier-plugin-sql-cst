import { CreateFunctionStmt, CreateProcedureStmt } from "sql-parser-cst";
import { isLanguageClause } from "./node_utils";

export const isJavaScriptLanguageClause = (
  clause: CreateFunctionStmt["clauses"][0],
): boolean => isLanguageClause(clause) && clause.name.name === "js";

export const isSqlLanguageClause = (
  clause: CreateFunctionStmt["clauses"][0] | CreateProcedureStmt["clauses"][0],
): boolean =>
  isLanguageClause(clause) && clause.name.name.toLowerCase() === "sql";

export const isPlpgsqlLanguageClause = (
  clause: CreateFunctionStmt["clauses"][0] | CreateProcedureStmt["clauses"][0],
): boolean =>
  isLanguageClause(clause) && clause.name.name.toLowerCase() === "plpgsql";
