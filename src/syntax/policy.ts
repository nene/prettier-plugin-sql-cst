import { AllPolicyNodes } from "sql-parser-cst";
import { group, join } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const policyMap: CstToDocMap<AllPolicyNodes> = {
  create_policy_stmt: (print, node) =>
    group([
      print.spaced(["createPolicyKw", "name", "onKw", "table"]),
      node.clauses.length > 0 ? print.dynamicLine() : [],
      join(print.dynamicLine(), print("clauses")),
    ]),

  policy_permissive_clause: (print) =>
    group(print.spaced(["asKw", "permissiveKw"])),
  policy_restrictive_clause: (print) =>
    group(print.spaced(["asKw", "restrictiveKw"])),
  policy_command_clause: (print) => group(print.spaced(["forKw", "commandKw"])),
  policy_roles_clause: (print) => group(print.spaced(["toKw", "roles"])),
  policy_using_clause: (print) => group(print.spaced(["usingKw", "expr"])),
  policy_check_clause: (print) =>
    group(print.spaced(["withKw", "checkKw", "expr"])),

  alter_policy_stmt: (print) =>
    group([
      print.spaced(["alterPolicyKw", "name", "onKw", "table"]),
      print.dynamicLine(),
      join(print.dynamicLine(), print("actions")),
    ]),

  drop_policy_stmt: (print) =>
    group(
      print.spaced([
        "dropPolicyKw",
        "ifExistsKw",
        "name",
        "onKw",
        "table",
        "behaviorKw",
      ]),
    ),
};
