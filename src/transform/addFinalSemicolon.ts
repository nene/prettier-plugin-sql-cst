import { Program } from "sql-parser-cst";
import { isEmpty } from "../node_utils";
import { last } from "../utils";

export const addFinalSemicolon = (
  program: Program,
  originalText: string
): Program => {
  if (!isEmpty(last(program.statements))) {
    const end = originalText.length;
    program.statements.push({ type: "empty", range: [end, end] });
  }
  return program;
};
