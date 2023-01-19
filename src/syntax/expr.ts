import { Node } from "sql-parser-cst";
import { arrayWrap } from "../utils";
import { CstToDocMap } from "../CstToDocMap";
import { join, line, softline, hardline, indent, group } from "../print_utils";

export const exprMap: Partial<CstToDocMap<Node>> = {
  list_expr: (print) => join([",", line], print("items")),
  paren_expr: (print, path) => {
    const parent = path.getParentNode() as Node;
    if (parent?.type === "func_call" || parent?.type === "create_table_stmt") {
      return ["(", indent([softline, print("expr")]), softline, ")"];
    } else {
      return ["(", print("expr"), ")"];
    }
  },
  binary_expr: (print) =>
    join(" ", [print("left"), ...arrayWrap(print("operator")), print("right")]),
  prefix_op_expr: (print) =>
    join(" ", [...arrayWrap(print("operator")), print("expr")]),
  postfix_op_expr: (print) =>
    join(" ", [print("expr"), ...arrayWrap(print("operator"))]),
  between_expr: (print) =>
    join(" ", [
      print("left"),
      ...arrayWrap(print("betweenKw")),
      ...print(["begin", "andKw", "end"]),
    ]),
  case_expr: (print) => [
    join(" ", print(["caseKw", "expr"])),
    indent([hardline, join(hardline, print("clauses"))]),
    hardline,
    print("endKw"),
  ],
  case_when: (print) =>
    join(" ", print(["whenKw", "condition", "thenKw", "result"])),
  case_else: (print) => join(" ", print(["elseKw", "result"])),
  member_expr: (print) => [print("object"), ".", print("property")],
  func_call: (print) => group(print(["name", "args"])),
  func_args: (print) => print("args"),
  number_literal: (print) => print("text"),
  boolean_literal: (print) => print("text"),
  string_literal: (print) => print("text"),
  null_literal: (print) => print("text"),
  identifier: (print) => print("text"),
};
