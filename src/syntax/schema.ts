import { AllSchemaStatements } from "sql-parser-cst";
import { group, hardline, join } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const schemaMap: Partial<CstToDocMap<AllSchemaStatements>> = {
  create_schema_stmt: (print) =>
    group(
      join(print.dynamicLine(), [
        print.spaced(["createSchemaKw", "ifNotExistsKw", "name"]),
        ...print("clauses"),
      ]),
    ),
  create_schema_authorization_clause: (print) =>
    print.spaced(["authorizationKw", "role"]),
  drop_schema_stmt: (print) =>
    print.spaced(["dropSchemaKw", "ifExistsKw", "schemas", "behaviorKw"]),
  alter_schema_stmt: (print) =>
    join(hardline, [
      print.spaced(["alterSchemaKw", "ifExistsKw", "name"]),
      ...print("actions"),
    ]),
};
