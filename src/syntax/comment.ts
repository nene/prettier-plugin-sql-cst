import { AllCommentNodes } from "sql-parser-cst";
import { group, indent, line } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const commentMap: Partial<CstToDocMap<AllCommentNodes>> = {
  comment_stmt: (print) =>
    group([
      print.spaced(["commentKw", "onKw", "target", "isKw"]),
      indent([line, print("message")]),
    ]),

  comment_target_function: (print) =>
    group([print.spaced(["functionKw", "name"]), print(["params"])]),
  comment_target_table: (print) => group(print.spaced(["tableKw", "name"])),
  comment_target_table_constraint: (print) =>
    group(print.spaced(["constraintKw", "name", "onKw", "tableName"])),
  comment_target_domain_constraint: (print) =>
    group(
      print.spaced(["constraintKw", "name", "onKw", "domainKw", "domainName"]),
    ),
};
