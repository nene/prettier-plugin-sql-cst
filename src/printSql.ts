import { Node } from "sql-parser-cst";
import { AstPath, Doc } from "prettier";
import { OldPrintFn, PrintableKey, PrintFn } from "./PrintFn";
import { arrayWrap, isArray, isDefined, isEmptyArray, isString } from "./utils";
import { transformMap } from "./syntax/transformMap";
import { NodeByType, ToDocFn } from "./CstToDocMap";
import { AllPrettierOptions } from "./options";
import { containsNewline, hardline, join, line } from "./print_utils";

export function printSql(
  path: AstPath<Node>,
  options: AllPrettierOptions,
  oldPrint: OldPrintFn,
): Doc {
  return printNode(path, options, createPrintFn(path, oldPrint, options));
}

let cachedPrintFn: PrintFn<Node>;
let cachedPath: AstPath<Node>;

function createPrintFn(
  path: AstPath<Node>,
  oldPrint: OldPrintFn,
  opts: AllPrettierOptions,
): PrintFn<Node> {
  // The path parameter will reference the same AstPath instance
  // during the whole printing cycle.
  // So we can keep using the same print function as long as
  // the path stays the same.
  if (cachedPath === path) {
    return cachedPrintFn;
  }

  cachedPath = path;
  cachedPrintFn = ((selector): Doc => {
    if (isArray(selector)) {
      const node = path.node;
      return selector.filter((sel) => isDefined(node[sel])).map(oldPrint);
    } else {
      return oldPrint(selector);
    }
  }) as PrintFn<Node>;

  cachedPrintFn.separated = (
    separator: Doc,
    selector: PrintableKey<Node> | PrintableKey<Node>[],
  ): Doc[] => {
    const node = path.node;
    const docs = arrayWrap(selector)
      .filter((sel) => isDefined(node[sel]))
      .map((sel) => [sel, oldPrint(sel)] as [PrintableKey<Node>, Doc])
      // skip empty arrays
      .filter(([sel, doc]) => !isEmptyArray(doc))
      // only join with spaces when input to print was Node[]
      .map(([sel, doc]) => (isArray(node[sel]) ? join(" ", doc) : doc));
    return docs.length > 0 ? [join(separator, docs)] : [];
  };

  cachedPrintFn.spaced = (
    selector: PrintableKey<Node> | PrintableKey<Node>[],
  ): Doc[] => cachedPrintFn.separated(" ", selector);

  cachedPrintFn.dynamicLine = (): Doc => {
    const node = path.node;
    return containsNewline(node, opts) ? hardline : line;
  };

  return cachedPrintFn;
}

function printNode(
  path: AstPath<Node>,
  options: AllPrettierOptions,
  print: PrintFn<Node>,
): Doc {
  const node = path.node;

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

  return fn(print, node, path, options);
}
