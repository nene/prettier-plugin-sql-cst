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
import { dclMap } from "./dcl";
import { deleteMap } from "./delete";
import { dropTableMap } from "./drop_table";
import { explainMap } from "./explain";
import { exprMap } from "./expr";
import { frameMap } from "./frame";
import { functionMap } from "./function";
import { indexMap } from "./index";
import { insertMap } from "./insert";
import { mergeMap } from "./merge";
import { proceduralLanguageMap } from "./procedural_language";
import { procedureMap } from "./procedure";
import { procClauseMap } from "./proc_clause";
import { programMap } from "./program";
import { schemaMap } from "./schema";
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
  ...dclMap,
  ...deleteMap,
  ...dropTableMap,
  ...explainMap,
  ...exprMap,
  ...frameMap,
  ...functionMap,
  ...indexMap,
  ...insertMap,
  ...mergeMap,
  ...procClauseMap,
  ...proceduralLanguageMap,
  ...procedureMap,
  ...programMap,
  ...schemaMap,
  ...selectMap,
  ...sqliteMap,
  ...transactionMap,
  ...triggerMap,
  ...truncateMap,
  ...updateMap,
  ...viewMap,
};
