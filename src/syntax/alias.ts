import { Alias } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";

export const aliasMap: CstToDocMap<Alias> = {
  alias: (print, node, path, options) => {
    switch (options.sqlAliasAs) {
      case "preserve":
        return print.spaced(["expr", "asKw", "alias"]);
      case "always":
        node.asKw = node.asKw || { type: "keyword", name: "AS", text: "AS" };
        return print.spaced(["expr", "asKw", "alias"]);
      case "never":
        return print.spaced(["expr", "alias"]);
    }
  },
};
