import { Node } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { aliasMap } from "./alias";
import { exprMap } from "./expr";
import { programMap } from "./program";
import { selectMap } from "./select";

export const transformMap: Partial<CstToDocMap<Node>> = {
  ...aliasMap,
  ...exprMap,
  ...programMap,
  ...selectMap,
  empty: () => [],
  keyword: (print, path) => path.getValue().text,
  all_columns: () => "*",
};
