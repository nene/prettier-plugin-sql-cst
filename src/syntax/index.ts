import { Node } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { aliasMap } from "./alias";
import { baseMap } from "./base";
import { constraintMap } from "./constraint";
import { createTableMap } from "./create_table";
import { dataTypeMap } from "./data_type";
import { deleteMap } from "./delete";
import { exprMap } from "./expr";
import { insertMap } from "./insert";
import { procClauseMap } from "./proc_clause";
import { programMap } from "./program";
import { selectMap } from "./select";
import { updateMap } from "./update";

export const transformMap: Partial<CstToDocMap<Node>> = {
  ...aliasMap,
  ...baseMap,
  ...constraintMap,
  ...createTableMap,
  ...dataTypeMap,
  ...deleteMap,
  ...exprMap,
  ...insertMap,
  ...procClauseMap,
  ...programMap,
  ...selectMap,
  ...updateMap,
};
