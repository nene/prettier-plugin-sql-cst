import { Node } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { join, line, softline, hardline, indent, group } from "../print_utils";
import { isCreateTableStmt, isValuesClause } from "../node_utils";

export const exprMap: Partial<CstToDocMap<Node>> = {
  list_expr: (print, node, path) => {
    const parent = path.getParentNode() as Node;
    return join(
      [",", isValuesClause(parent) ? hardline : line],
      print("items").map((it) => group(it))
    );
  },
  paren_expr: (print, node, path) => {
    const parent = path.getParentNode() as Node;
    const lineStyle = isCreateTableStmt(parent) ? hardline : softline;
    return group(["(", indent([lineStyle, print("expr")]), lineStyle, ")"]);
  },
  binary_expr: (print) => print.spaced(["left", "operator", "right"]),
  prefix_op_expr: (print) => print.spaced(["operator", "expr"]),
  postfix_op_expr: (print) => print.spaced(["expr", "operator"]),
  between_expr: (print) =>
    print.spaced(["left", "betweenKw", "begin", "andKw", "end"]),
  case_expr: (print) => [
    print.spaced(["caseKw", "expr"]),
    indent([hardline, join(hardline, print("clauses"))]),
    hardline,
    print("endKw"),
  ],
  case_when: (print) =>
    print.spaced(["whenKw", "condition", "thenKw", "result"]),
  case_else: (print) => print.spaced(["elseKw", "result"]),
  member_expr: (print) => join("", [print("object"), ".", print("property")]),
  func_call: (print) => group(print(["name", "args"])),
  func_args: (print) => print.spaced(["distinctKw", "args"]),
  cast_expr: (print) => join("", print(["castKw", "args"])),
  cast_arg: (print) => print.spaced(["expr", "asKw", "dataType"]),
  number_literal: (print) => print("text"),
  boolean_literal: (print) => print("text"),
  string_literal: (print) => print("text"),
  null_literal: (print) => print("text"),
  identifier: (print) => print("text"),
};
