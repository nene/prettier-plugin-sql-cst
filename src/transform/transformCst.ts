import { Program } from "sql-parser-cst";
import { moveCommentsToRoot } from "./comments";
import { processAliasAs } from "./aliasAs";
import { stripTrailingCommas } from "./stripTrailingCommas";
import { addFinalSemicolon } from "./addFinalSemicolon";
import { SqlPluginOptions } from "src/options";
import { tempToTemporary } from "./tempToTemporary";
import { namedArguments } from "./namedArguments";
import { comparisonOp } from "./comparisonOp";
import { distinctrow } from "./distinctrow";

export const transformCst = (
  cst: Program,
  originalText: string,
  options: SqlPluginOptions,
): Program => {
  const transforms = [
    // Note that we first perform moveCommentsToRoot transform,
    // so we don't need to worry about comments interfering with other transforms
    moveCommentsToRoot,
    stripTrailingCommas,
    addFinalSemicolon,
  ];
  if (options.sqlCanonicalSyntax) {
    transforms.push(
      processAliasAs,
      tempToTemporary,
      namedArguments,
      comparisonOp,
      distinctrow,
    );
  }

  return transforms.reduce(
    (cst, transform) => transform(cst, originalText),
    cst,
  );
};
