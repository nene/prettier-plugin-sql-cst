import {
  CreateFunctionStmt,
  CreateProcedureStmt,
  Identifier,
  StringLiteral,
} from "sql-parser-cst";
import { isLanguageClause } from "./node_utils";

export const isJavaScriptLanguageClause = (
  clause: CreateFunctionStmt["clauses"][0],
): boolean => isLanguageClause(clause) && languageName(clause.name) === "js";

export const isSqlLanguageClause = (
  clause: CreateFunctionStmt["clauses"][0] | CreateProcedureStmt["clauses"][0],
): boolean =>
  isLanguageClause(clause) && languageName(clause.name).toLowerCase() === "sql";

export const isPlpgsqlLanguageClause = (
  clause: CreateFunctionStmt["clauses"][0] | CreateProcedureStmt["clauses"][0],
): boolean =>
  isLanguageClause(clause) &&
  languageName(clause.name).toLowerCase() === "plpgsql";

const languageName = (node: Identifier | StringLiteral): string =>
  node.type === "string_literal" ? node.value : node.name;
