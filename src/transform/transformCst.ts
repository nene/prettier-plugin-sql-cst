import { Program } from "sql-parser-cst";
import { moveCommentsToRoot } from "./comments";
import { processAliasAs } from "./aliasAs";
import { AllPrettierOptions } from "../options";

export const transformCst = (
  cst: Program,
  options: AllPrettierOptions
): Program => moveCommentsToRoot(processAliasAs(cst));
