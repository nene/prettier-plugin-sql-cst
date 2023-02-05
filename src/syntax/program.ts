import { Node, Program } from "sql-parser-cst";
import { Doc } from "prettier";
import { hardline } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const programMap: CstToDocMap<Program> = {
  program: (print, node) => [
    print("statements").map((doc, i) =>
      printStatement(doc, i, node.statements)
    ),
    hardline,
  ],
};

const printStatement = (doc: Doc, i: number, statements: Node[]): Doc => {
  const node = statements[i];
  if (i === 0) {
    return doc;
  } else if (i < statements.length - 1 || node.type !== "empty") {
    return [";", hardline, hardline, doc];
  } else {
    return [";", doc];
  }
};
