import { Node } from "sql-parser-cst";
import { AstPath, Doc, ParserOptions } from "prettier";
import { OldPrintFn, PrintFn } from "./PrintFn";
import { isArray, isDefined, isString } from "./utils";
import { transformMap } from "./syntax";
import { NodeByType, ToDocFn } from "./CstToDocMap";
import { SqlPluginOptions } from "options";

export function printSql(
  path: AstPath<Node>,
  options: ParserOptions<Node> & SqlPluginOptions,
  oldPrint: OldPrintFn
): Doc {
  const print: PrintFn<Node> = ((selector): Doc => {
    if (isArray(selector)) {
      const node = path.getValue();
      return selector.filter((sel) => isDefined(node[sel])).map(oldPrint);
    } else {
      return oldPrint(selector);
    }
  }) as PrintFn<Node>;

  return printNode(path, options, print);
}

function printNode(
  path: AstPath<Node>,
  options: ParserOptions<Node> & SqlPluginOptions,
  print: PrintFn<Node>
): Doc {
  const node = path.getValue();

  if (isArray(node)) {
    return path.map(print as OldPrintFn);
  }
  if (isString(node)) {
    return node;
  }

  if (!node?.type) {
    throw new Error(`No type field on node: ${JSON.stringify(node)}`);
  }

  const fn = transformMap[node.type] as ToDocFn<
    NodeByType<(typeof node)["type"], Node>
  >;

  if (!fn) {
    throw new Error(`Unexpected node type: ${node.type}`);
  }

  return fn(print, path, options);
}
