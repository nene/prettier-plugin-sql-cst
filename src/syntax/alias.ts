import { Alias } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { join } from "../print_utils";

export const aliasMap: CstToDocMap<Alias> = {
  alias: (print) => join(" ", print(["expr", "asKw", "alias"])),
};
