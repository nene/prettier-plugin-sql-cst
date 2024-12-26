import { AllRoleNodes } from "sql-parser-cst";
import { group, indent, join, line } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const roleMap: Partial<CstToDocMap<AllRoleNodes>> = {
  create_role_stmt: (print, node) =>
    group([
      print.spaced(["createRoleKw", "name", "withKw"]),
      ...(node.options?.length
        ? [indent([line, join(print.dynamicLine(), print("options"))])]
        : []),
    ]),
  drop_role_stmt: (print) =>
    group(print.spaced(["dropRoleKw", "ifExistsKw", "names"])),

  role_option_keyword: (print) => print("kw"),
  role_option_connection_limit: (print) =>
    group(print.spaced(["connectionLimitKw", "limit"])),
  role_option_password: (print) =>
    group(print.spaced(["encryptedKw", "passwordKw", "password"])),
  role_option_valid_until: (print) =>
    group(print.spaced(["validUntilKw", "timestamp"])),
  role_option_in_role: (print) => group(print.spaced(["inRoleKw", "names"])),
  role_option_role: (print) => group(print.spaced(["roleKw", "names"])),
  role_option_admin: (print) => group(print.spaced(["adminKw", "names"])),
  role_option_sysid: (print) => group(print.spaced(["sysIdKw", "sysId"])),
};
