import { Program, Node } from "sql-parser-cst";
import { ParserOptions } from "prettier";
import { moveCommentsToRoot } from "./comments";
import { processAliasAs } from "./aliasAs";
import { SqlPluginOptions } from "../options";

export const transformCst = (
  cst: Program,
  options: ParserOptions<Node> & SqlPluginOptions
): Program => moveCommentsToRoot(processAliasAs(cst, options));
