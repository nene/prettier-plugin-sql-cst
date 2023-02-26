import { Node, Program } from "sql-parser-cst";
import { Doc } from "prettier";
import { hardline, hasEmptyLineBetweenNodes } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";
import { AllPrettierOptions } from "src/options";

export const programMap: CstToDocMap<Program> = {
  program: (print, node, path, options) =>
    print("statements").map((doc, i) =>
      printStatement(doc, i, node.statements, options)
    ),
};

const printStatement = (
  doc: Doc,
  i: number,
  statements: Node[],
  options: AllPrettierOptions<Program>
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
