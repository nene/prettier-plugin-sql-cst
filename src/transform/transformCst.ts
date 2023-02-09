import { Program } from "sql-parser-cst";
import { moveCommentsToRoot } from "./comments";
import { processAliasAs } from "./aliasAs";
import { stripTrailingCommas } from "./stripTrailingCommas";
import { addFinalSemicolon } from "./addFinalSemicolon";

// Note that we first perform moveCommentsToRoot transform,
// so we don't need to worry about comments interfering with other transforms
export const transformCst = (cst: Program, originalText: string): Program =>
  addFinalSemicolon(
    stripTrailingCommas(processAliasAs(moveCommentsToRoot(cst))),
    originalText
  );
