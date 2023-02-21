import { Node } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { aliasMap } from "./alias";
import { alterTableMap } from "./alter_table";
import { baseMap } from "./base";
import { bigqueryMap } from "./bigquery";
import { constraintMap } from "./constraint";
import { createTableMap } from "./create_table";
import { dataTypeMap } from "./data_type";
import { deleteMap } from "./delete";
import { dropTableMap } from "./drop_table";
import { exprMap } from "./expr";
import { frameMap } from "./frame";
import { indexMap } from "./index";
import { insertMap } from "./insert";
import { proceduralLanguageMap } from "./procedural_language";
import { procClauseMap } from "./proc_clause";
import { programMap } from "./program";
import { selectMap } from "./select";
import { sqliteMap } from "./sqlite";
import { triggerMap } from "./trigger";
import { truncateMap } from "./truncate";
import { updateMap } from "./update";
import { viewMap } from "./view";

export const transformMap: Partial<CstToDocMap<Node>> = {
  ...aliasMap,
  ...alterTableMap,
  ...baseMap,
  ...bigqueryMap,
  ...constraintMap,
  ...createTableMap,
  ...dataTypeMap,
  ...deleteMap,
  ...dropTableMap,
  ...exprMap,
  ...frameMap,
  ...indexMap,
  ...insertMap,
  ...procClauseMap,
  ...proceduralLanguageMap,
  ...programMap,
  ...selectMap,
  ...sqliteMap,
  ...triggerMap,
  ...truncateMap,
  ...updateMap,
  ...viewMap,
};
