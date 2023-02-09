import { Node, Program } from "sql-parser-cst";
import { Doc } from "prettier";
import { group, hardline, softline } from "../print_utils";
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
    return [doc, ";"];
  } else if (node.type === "empty") {
    return group([softline, doc]);
  } else {
    return [hardline, hardline, doc, ";"];
  }
};
