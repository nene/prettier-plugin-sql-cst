import { AllDclStatements } from "sql-parser-cst";
import { group, indent, join, line } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const dclMap: CstToDocMap<AllDclStatements> = {
  grant_stmt: (print) =>
    group(
      join(print.dynamicLine(), [
        group([print("grantKw"), indent([line, print("roles")])]),
        group(print.spaced(["onKw", "resourceType", "resourceName"])),
        group([print("toKw"), indent([line, print("users")])]),
      ]),
    ),
  revoke_stmt: (print) =>
    group(
      join(print.dynamicLine(), [
        group([print("revokeKw"), indent([line, print("roles")])]),
        group(print.spaced(["onKw", "resourceType", "resourceName"])),
        group([print("fromKw"), indent([line, print("users")])]),
      ]),
    ),
};
