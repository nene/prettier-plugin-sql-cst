import { AllDclStatements } from "sql-parser-cst";
import { group, hardline, indent, join, line } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const dclMap: Partial<CstToDocMap<AllDclStatements>> = {
  grant_stmt: (print) =>
    join(hardline, [
      group([print("grantKw"), indent([line, print("roles")])]),
      group(print.spaced(["onKw", "resourceType", "resourceName"])),
      group([print("toKw"), indent([line, print("users")])]),
    ]),
  revoke_stmt: (print) =>
    join(hardline, [
      group([print("revokeKw"), indent([line, print("roles")])]),
      group(print.spaced(["onKw", "resourceType", "resourceName"])),
      group([print("fromKw"), indent([line, print("users")])]),
    ]),
};
