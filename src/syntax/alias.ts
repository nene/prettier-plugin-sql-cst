import { Alias } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";

export const aliasMap: CstToDocMap<Alias> = {
  alias: (print) => print.spaced(["expr", "asKw", "alias", "columnAliases"]),
};
