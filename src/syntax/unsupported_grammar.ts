import { group } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";
import { UnsupportedGrammarStmt } from "sql-parser-cst/lib/cst/UnsupportedGrammar";

export const unsupportedGrammarMap: CstToDocMap<UnsupportedGrammarStmt> = {
  unsupported_grammar_stmt: (print) => group(print("text")),
};
