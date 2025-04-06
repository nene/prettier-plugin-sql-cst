import { Node, Program } from "sql-parser-cst";
import { Doc } from "prettier";
import { hardline, hasEmptyLineBetweenNodes } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";
import { AllPrettierOptions } from "src/options";

export const programMap: CstToDocMap<Program> = {
  program: (print, node, path, options) =>
    print("statements").map((doc, i) =>
      i === node.statements.length - 1
        ? printFinalStatement(doc, i, node.statements, options)
        : printStatement(doc, i, node.statements, options),
    ),
};

const printStatement = (
  doc: Doc,
  i: number,
  statements: Node[],
  options: AllPrettierOptions<Program>,
): Doc => {
  const prevNode = statements[i - 1];
  const node = statements[i];
  if (i === 0) {
    return doc;
  } else if (node.type !== "empty") {
    if (hasEmptyLineBetweenNodes(prevNode, node, options)) {
      return [";", hardline, hardline, doc];
    } else {
      return [";", hardline, doc];
    }
  } else {
    return [";", hardline, doc];
  }
};

const printFinalStatement = (
  doc: Doc,
  i: number,
  statements: Node[],
  options: AllPrettierOptions<Program>,
): Doc => {
  const stmtDoc = printStatement(doc, i, statements, options);
  if (statements[i].type === "empty") {
    // When the final statement is an empty statement,
    // this means we have inserted a semicolon and newline before it.
    // So nothing else is needed.
    return stmtDoc;
  } else {
    // If the last statement is not empty,
    // this means sqlFinalSemicolon option is false,
    // so we need to add an empty line after it.
    return [stmtDoc, hardline];
  }
};
