import { Program } from "sql-parser-cst";
import { moveCommentsToRoot } from "./comments";
import { processAliasAs } from "./aliasAs";
import { stripTrailingCommas } from "./stripTrailingCommas";
import { AllPrettierOptions } from "../options";

// Note that we first perform moveCommentsToRoot transform,
// so we don't need to worry about comments interfering with other transforms
export const transformCst = (
  cst: Program,
  options: AllPrettierOptions
): Program => stripTrailingCommas(processAliasAs(moveCommentsToRoot(cst)));
