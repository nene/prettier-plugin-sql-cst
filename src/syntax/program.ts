import { Node, Program } from "sql-parser-cst";
import { AstPath, Doc } from "prettier";
import { hardline } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const programMap: CstToDocMap<Program> = {
  program: (print, node, path) => path.map(printLineWith(print), "statements"),
};

const printLineWith =
  <T extends Node>(print: (x: AstPath<T>) => Doc) =>
  (childPath: AstPath<T>, i: number, all: T[]): Doc => {
    const node = childPath.getValue();
    if (i === 0) {
      return print(childPath);
    } else if (i < all.length - 1 || node.type !== "empty") {
      return [";", hardline, print(childPath)];
    } else {
      return [";", print(childPath)];
    }
  };
