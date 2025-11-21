import { AllSchemaStatements } from "sql-parser-cst";
import { group, hardline, indent, join } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const schemaMap: CstToDocMap<AllSchemaStatements> = {
  create_schema_stmt: (print, node) =>
    group([
      group(
        join(print.dynamicLine(), [
          print.spaced(["createSchemaKw", "ifNotExistsKw", "name"]),
          ...print("clauses"),
        ]),
      ),
      node.statements.length > 0
        ? indent([hardline, join(hardline, print("statements"))])
        : [],
    ]),
  create_schema_authorization_clause: (print) =>
    print.spaced(["authorizationKw", "role"]),
  drop_schema_stmt: (print) =>
    group(
      print.spaced(["dropSchemaKw", "ifExistsKw", "schemas", "behaviorKw"]),
    ),
  alter_schema_stmt: (print) =>
    group(
      join(print.dynamicLine(), [
        print.spaced(["alterSchemaKw", "ifExistsKw", "name"]),
        ...print("actions"),
      ]),
    ),
};
