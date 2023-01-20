import { AllColumns, Empty, Keyword } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";

export const baseMap: Partial<CstToDocMap<Keyword | Empty | AllColumns>> = {
  keyword: (print, node, path, options) => {
    switch (options.sqlKeywordCase) {
      case "preserve":
        return path.getValue().text;
      case "upper":
        return path.getValue().text.toUpperCase();
      case "lower":
        return path.getValue().text.toLowerCase();
    }
  },
  all_columns: () => "*",
  empty: () => [],
};
