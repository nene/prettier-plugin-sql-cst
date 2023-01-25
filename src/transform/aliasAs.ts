import { ParserOptions } from "prettier";
import { cstVisitor, Program, Node } from "sql-parser-cst";
import { SqlPluginOptions } from "../options";

export const processAliasAs = (
  cst: Program,
  options: ParserOptions<Node> & SqlPluginOptions
): Program => {
  const mutateAliases = cstVisitor({
    alias: (node) => {
      switch (options.sqlAliasAs) {
        case "preserve":
          // do nothing
          break;
        case "always":
          // Add AS keyword if none exists
          node.asKw = node.asKw || { type: "keyword", name: "AS", text: "AS" };
          break;
        case "never":
          // Remove AS keyword and ensure comments attached to it don't get lost
          if (node.asKw && (node.leading?.length || node.trailing?.length)) {
            const comments = [
              ...(node.leading || []),
              ...(node.trailing || []),
            ];
            node.alias.leading = [...comments, ...(node.alias.leading || [])];
          }
          node.asKw = undefined;
      }
    },
  });

  mutateAliases(cst);

  return cst;
};
