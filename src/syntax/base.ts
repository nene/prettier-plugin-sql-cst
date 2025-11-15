import { AllColumns, Empty, Keyword, Node } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { AstPath } from "prettier";

export const baseMap: CstToDocMap<Keyword | Empty | AllColumns> = {
  /** cst-ignore: name */
  keyword: (print, node, path, options) => {
    // Treat PostgreSQL "WITH TIME ZONE" as part of data type, not keyword,
    // so skip keyword case conversion for it
    if ((path as AstPath<Node>).parent?.type === "with_time_zone_data_type") {
      return path.node.text;
    }
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
