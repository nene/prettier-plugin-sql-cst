import { Printer } from "prettier";
import { CreateFunctionStmt, Node, StringLiteral } from "sql-parser-cst";
import {
  isAsClause,
  isCreateFunctionStmt,
  isLanguageClause,
  isStringLiteral,
} from "./node_utils";
import { hardline, indent, stripTrailingHardline } from "./print_utils";

export const embedSql: NonNullable<Printer<Node>["embed"]> = (path, options) => {
  const node = path.node;
  const parent = path.getParentNode(0);
  const grandParent = path.getParentNode(1);

  if (
    isStringLiteral(node) &&
    isAsClause(parent) &&
    isCreateFunctionStmt(grandParent) &&
    grandParent.clauses.some(isSqlLanguageClause)
  ) {
    return async (textToDoc) => {
      const quote = detectQuote(node);

      if (quote) {
        const sql = await textToDoc(node.value, options);

        return [
          quote,
          indent([hardline, stripTrailingHardline(sql)]),
          hardline,
          quote,
        ];
      }
    };
  }

  return null;
};

const isSqlLanguageClause = (
  clause: CreateFunctionStmt["clauses"][0],
): boolean => isLanguageClause(clause) && clause.name.name === "sql";

const detectQuote = (
  node: StringLiteral,
): string | undefined => {
  const match = node.text.match(/^('|\$[^$]*\$)/);
  return match?.[1];
};
