import { Node } from "sql-parser-cst";
import { AstPath, Doc, ParserOptions } from "prettier";
import { printNode } from "./printNode";
import { PrintFn } from "./PrintFn";
import { isArray, isDefined } from "./utils";

export function printSql(
  path: AstPath<Node>,
  options: ParserOptions<Node>,
  oldPrint: PrintFn<Node>
): Doc {
  const print: PrintFn<Node> = (selector): Doc => {
    if (isArray(selector)) {
      const node = path.getValue();
      return selector.filter((sel) => isDefined(node[sel])).map(oldPrint);
    } else {
      return oldPrint(selector);
    }
  };

  return printNode(path, options, print);
}
