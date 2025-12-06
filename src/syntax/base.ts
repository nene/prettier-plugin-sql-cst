import { AllColumns, Empty, Keyword, Node } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { isDataType } from "../node_utils";

export const baseMap: CstToDocMap<Keyword | Empty | AllColumns> = {
  /** cst-ignore: name */
  keyword: (print, node, path, options) => {
    const keywordCase = isDataType(path.parent)
      ? options.sqlTypeCase
      : options.sqlKeywordCase;

    switch (keywordCase) {
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
