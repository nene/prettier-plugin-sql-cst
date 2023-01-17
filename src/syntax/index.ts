import { Node } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { aliasMap } from "./alias";
import { constraintMap } from "./constraint";
import { createTableMap } from "./create_table";
import { dataTypeMap } from "./data_type";
import { exprMap } from "./expr";
import { programMap } from "./program";
import { selectMap } from "./select";

export const transformMap: Partial<CstToDocMap<Node>> = {
  ...aliasMap,
  ...constraintMap,
  ...createTableMap,
  ...dataTypeMap,
  ...exprMap,
  ...programMap,
  ...selectMap,
  empty: () => [],
  keyword: (print, path, options) => {
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
};
