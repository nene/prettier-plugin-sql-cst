import { Node } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { aliasMap } from "./alias";
import { alterTableMap } from "./alter_table";
import { analyzeMap } from "./analyze";
import { baseMap } from "./base";
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
import { preparedStatementsMap } from "./prepared_statements";
import { proceduralLanguageMap } from "./procedural_language";
import { procedureMap } from "./procedure";
import { procClauseMap } from "./proc_clause";
import { programMap } from "./program";
import { schemaMap } from "./schema";
import { selectMap } from "./select";
import { transactionMap } from "./transaction";
import { triggerMap } from "./trigger";
import { truncateMap } from "./truncate";
import { updateMap } from "./update";
import { viewMap } from "./view";

import { bigqueryMap } from "./dialects/bigquery";
import { mysqlMap } from "./dialects/mysql";
import { sqliteMap } from "./dialects/sqlite";
import { postgresqlMap } from "./dialects/postgresql";

export const transformMap: Partial<CstToDocMap<Node>> = {
  ...aliasMap,
  ...alterTableMap,
  ...analyzeMap,
  ...baseMap,
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
  ...preparedStatementsMap,
  ...procClauseMap,
  ...proceduralLanguageMap,
  ...procedureMap,
  ...programMap,
  ...schemaMap,
  ...selectMap,
  ...transactionMap,
  ...triggerMap,
  ...truncateMap,
  ...updateMap,
  ...viewMap,

  ...bigqueryMap,
  ...mysqlMap,
  ...postgresqlMap,
  ...sqliteMap,
};
