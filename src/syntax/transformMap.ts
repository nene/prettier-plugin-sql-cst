import { Node } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { aliasMap } from "./alias";
import { alterTableMap } from "./alter_table";
import { analyzeMap } from "./analyze";
import { baseMap } from "./base";
import { bigqueryMap } from "./bigquery";
import { constraintMap } from "./constraint";
import { createTableMap } from "./create_table";
import { dataTypeMap } from "./data_type";
import { deleteMap } from "./delete";
import { dropTableMap } from "./drop_table";
import { explainMap } from "./explain";
import { exprMap } from "./expr";
import { frameMap } from "./frame";
import { indexMap } from "./index";
import { insertMap } from "./insert";
import { proceduralLanguageMap } from "./procedural_language";
import { procClauseMap } from "./proc_clause";
import { programMap } from "./program";
import { selectMap } from "./select";
import { sqliteMap } from "./sqlite";
import { transactionMap } from "./transaction";
import { triggerMap } from "./trigger";
import { truncateMap } from "./truncate";
import { updateMap } from "./update";
import { viewMap } from "./view";

export const transformMap: Partial<CstToDocMap<Node>> = {
  ...aliasMap,
  ...alterTableMap,
  ...analyzeMap,
  ...baseMap,
  ...bigqueryMap,
  ...constraintMap,
  ...createTableMap,
  ...dataTypeMap,
  ...deleteMap,
  ...dropTableMap,
  ...explainMap,
  ...exprMap,
  ...frameMap,
  ...indexMap,
  ...insertMap,
  ...procClauseMap,
  ...proceduralLanguageMap,
  ...programMap,
  ...selectMap,
  ...sqliteMap,
  ...transactionMap,
  ...triggerMap,
  ...truncateMap,
  ...updateMap,
  ...viewMap,
};
