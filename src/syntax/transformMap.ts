import { Node } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { aliasMap } from "./alias";
import { alterActionMap } from "./alter_action";
import { alterTableMap } from "./alter_table";
import { analyzeMap } from "./analyze";
import { baseMap } from "./base";
import { constraintMap } from "./constraint";
import { createTableMap } from "./create_table";
import { dataTypeMap } from "./data_type";
import { dclMap } from "./dcl";
import { deleteMap } from "./delete";
import { domainMap } from "./domain";
import { dropTableMap } from "./drop_table";
import { explainMap } from "./explain";
import { exprMap } from "./expr";
import { frameMap } from "./frame";
import { functionMap } from "./function";
import { indexMap } from "./index";
import { insertMap } from "./insert";
import { mergeMap } from "./merge";
import { otherClausesMap } from "./other_clauses";
import { renameTableMap } from "./rename_table";
import { preparedStatementsMap } from "./prepared_statements";
import { proceduralLanguageMap } from "./procedural_language";
import { procedureMap } from "./procedure";
import { procClauseMap } from "./proc_clause";
import { programMap } from "./program";
import { schemaMap } from "./schema";
import { selectMap } from "./select";
import { sequenceMap } from "./sequence";
import { transactionMap } from "./transaction";
import { triggerMap } from "./trigger";
import { truncateMap } from "./truncate";
import { typeMap } from "./type";
import { unsupportedGrammarMap } from "./unsupported_grammar";
import { updateMap } from "./update";
import { viewMap } from "./view";

import { bigqueryMap } from "./dialects/bigquery";
import { mysqlMap } from "./dialects/mysql";
import { sqliteMap } from "./dialects/sqlite";
import { postgresqlMap } from "./dialects/postgresql";

export const transformMap: CstToDocMap<Node> = {
  ...aliasMap,
  ...alterActionMap,
  ...alterTableMap,
  ...analyzeMap,
  ...baseMap,
  ...constraintMap,
  ...createTableMap,
  ...dataTypeMap,
  ...dclMap,
  ...deleteMap,
  ...domainMap,
  ...dropTableMap,
  ...explainMap,
  ...exprMap,
  ...frameMap,
  ...functionMap,
  ...indexMap,
  ...insertMap,
  ...mergeMap,
  ...otherClausesMap,
  ...preparedStatementsMap,
  ...procClauseMap,
  ...proceduralLanguageMap,
  ...procedureMap,
  ...programMap,
  ...renameTableMap,
  ...schemaMap,
  ...selectMap,
  ...sequenceMap,
  ...transactionMap,
  ...triggerMap,
  ...truncateMap,
  ...typeMap,
  ...unsupportedGrammarMap,
  ...updateMap,
  ...viewMap,

  ...bigqueryMap,
  ...mysqlMap,
  ...postgresqlMap,
  ...sqliteMap,
};
