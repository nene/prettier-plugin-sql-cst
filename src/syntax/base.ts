import { AllColumns, Empty, Keyword, Node } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";

export const baseMap: CstToDocMap<Keyword | Empty | AllColumns> = {
  /** cst-ignore: name */
  keyword: (print, node, path, options) => {
    switch (options.sqlKeywordCase) {
      case "preserve":
        return path.node.text;
      case "upper":
        return path.node.text.toUpperCase();
      case "lower":
        return path.node.text.toLowerCase();
    }
  },
  all_columns: () => "*",
  empty: () => [],
};
