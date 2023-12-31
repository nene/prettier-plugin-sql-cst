import { AllSchemaStatements } from "sql-parser-cst";
import { hardline, join } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const schemaMap: CstToDocMap<AllSchemaStatements> = {
  create_schema_stmt: (print) =>
    join(hardline, [
      print.spaced(["createSchemaKw", "ifNotExistsKw", "name"]),
      ...print("options"),
    ]),
  drop_schema_stmt: (print) =>
    print.spaced(["dropSchemaKw", "ifExistsKw", "name", "behaviorKw"]),
  alter_schema_stmt: (print) =>
    join(hardline, [
      print.spaced(["alterSchemaKw", "ifExistsKw", "name"]),
      ...print("actions"),
    ]),
};
