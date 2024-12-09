import { AllDclNodes } from "sql-parser-cst";
import { group, indent, join, line } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const dclMap: Partial<CstToDocMap<AllDclNodes>> = {
  grant_privilege_stmt: (print) =>
    group(
      join(print.dynamicLine(), [
        group([print("grantKw"), indent([line, print("privileges")])]),
        group(print.spaced(["onKw", "resource"])),
        group([print("toKw"), indent([line, print("roles")])]),
      ]),
    ),
  revoke_privilege_stmt: (print) =>
    group(
      join(print.dynamicLine(), [
        group([print("revokeKw"), indent([line, print("privileges")])]),
        group(print.spaced(["onKw", "resource"])),
        group([print("fromKw"), indent([line, print("roles")])]),
      ]),
    ),

  grant_resource_table: (print) => group(print.spaced(["tableKw", "tables"])),
  grant_resource_view: (print) => group(print.spaced(["viewKw", "views"])),
  grant_resource_schema: (print) =>
    group(print.spaced(["schemaKw", "schemas"])),
};
