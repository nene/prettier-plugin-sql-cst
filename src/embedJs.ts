import { Printer } from "prettier";
import { CreateFunctionStmt, Node } from "sql-parser-cst";
import {
  isAsClause,
  isCreateFunctionStmt,
  isLanguageClause,
  isStringLiteral,
} from "./node_utils";
import { hardline, indent, stripTrailingHardline } from "./print_utils";

export const embedJs: NonNullable<Printer<Node>["embed"]> = (
  path,
  print,
  textToDoc,
  options
) => {
  const node = path.getValue();
  const parent = path.getParentNode(0);
  const grandParent = path.getParentNode(1);
  if (
    isStringLiteral(node) &&
    isAsClause(parent) &&
    isCreateFunctionStmt(grandParent) &&
    grandParent.clauses.some(isJavaScriptLanguageClause)
  ) {
    if (containsTripleQuote(node.value)) {
      // Give up for now. Don't format JSON inside the string.
      // Tackle these corner-case in the future.
      return null;
    }
    const js = textToDoc(node.value, {
      ...options,
      parser: "babel",
    });
    return [
      "r'''",
      indent([hardline, stripTrailingHardline(js)]),
      hardline,
      "'''",
    ];
  }
  return null;
};

const isJavaScriptLanguageClause = (
  clause: CreateFunctionStmt["clauses"][0]
): boolean => isLanguageClause(clause) && clause.name.name === "js";

const containsTripleQuote = (json: string) => /'''/.test(json);
