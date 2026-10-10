import {
  CreateFunctionStmt,
  CreateProcedureStmt,
  Identifier,
  StringLiteral,
} from "sql-parser-cst";
import { isIdentifier, isLanguageClause } from "./node_utils";

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
  isIdentifier(node) ? node.name : node.value;
