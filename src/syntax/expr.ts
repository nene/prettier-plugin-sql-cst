import { AllExprNodes, Keyword, Node } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import {
  join,
  line,
  softline,
  hardline,
  indent,
  group,
  stripTrailingHardline,
} from "../print_utils";
import {
  isCreateTableStmt,
  isKeyword,
  isValuesClause,
  isEmpty,
  isArraySubscript,
  isParenExpr,
  isFuncArgs,
  isListExpr,
  isProgram,
} from "../node_utils";
import { isString, last } from "../utils";

export const exprMap: Partial<CstToDocMap<AllExprNodes>> = {
  list_expr: (print, node, path) => {
    const parent = path.getParentNode() as Node;
    const children = print("items").map((it) => group(it));
    const lineType = isValuesClause(parent) ? hardline : line;
    // When last item is type:empty, we're dealing with a trailing comma.
    // Don't add a space (or newline) after it.
    // We still want to print it though, as it might have comments attached.
    if (isEmpty(last(node.items))) {
      return [
        join([",", lineType], children.slice(0, -1)),
        ",",
        last(children),
      ];
    } else {
      return join([",", lineType], children);
    }
  },
  paren_expr: (print, node, path) => {
    // discard unnecessary nested ((parentheses))
    if (isParenExpr(node.expr)) {
      return print("expr");
    }
    // Discard unnecessary parenthesis around function arguments
    if (
      isListExpr(path.getParentNode(0)) &&
      isFuncArgs(path.getParentNode(1))
    ) {
      return print("expr");
    }
    const parent = path.getParentNode() as Node;
    const lineStyle = isCreateTableStmt(parent) ? hardline : softline;
    return group(["(", indent([lineStyle, print("expr")]), lineStyle, ")"]);
  },
  binary_expr: (print, node) => {
    if (isKeyword(node.operator) && isBooleanOp(node.operator)) {
      return join(line, [print("left"), print.spaced(["operator", "right"])]);
    }
    return print.spaced(["left", "operator", "right"]);
  },
  prefix_op_expr: (print, node) =>
    (isString(node.operator) ? print : print.spaced)(["operator", "expr"]),
  postfix_op_expr: (print) => print.spaced(["expr", "operator"]),
  between_expr: (print) =>
    print.spaced(["left", "betweenKw", "begin", "andKw", "end"]),
  case_expr: (print) => [
    print.spaced(["caseKw", "expr"]),
    indent([hardline, join(hardline, print("clauses"))]),
    hardline,
    print("endKw"),
  ],
  case_when: (print, node) => {
    if (isProgram(node.result)) {
      return [
        print.spaced(["whenKw", "condition", "thenKw"]),
        indent([hardline, stripTrailingHardline(print("result"))]),
      ];
    }
    return print.spaced(["whenKw", "condition", "thenKw", "result"]);
  },
  case_else: (print, node) => {
    if (isProgram(node.result)) {
      return [
        print("elseKw"),
        indent([hardline, stripTrailingHardline(print("result"))]),
      ];
    }
    return print.spaced(["elseKw", "result"]);
  },
  member_expr: (print, node) =>
    isArraySubscript(node.property)
      ? print(["object", "property"])
      : [print("object"), ".", print("property")],
  bigquery_quoted_member_expr: (print) => ["`", print("expr"), "`"],
  array_subscript: (print) =>
    group(["[", indent([softline, print("expr")]), softline, "]"]),
  array_subscript_specifier: (print) => print(["specifierKw", "args"]),
  func_call: (print) => {
    const fnCall = print(["name", "args"]);
    const extras = print(["filter", "over"]);
    if (extras.length > 1) {
      return group([fnCall, indent([line, join(line, extras)])]);
    } else {
      return group(join(" ", [fnCall, ...extras]));
    }
  },
  func_args: (print) => print.spaced(["distinctKw", "args", "having"]),
  filter_arg: (print) => print.spaced(["filterKw", "where"]),
  over_arg: (print) => print.spaced(["overKw", "window"]),
  having_arg: (print) => print.spaced(["havingKw", "minMaxKw", "expr"]),
  cast_expr: (print) => print(["castKw", "args"]),
  cast_arg: (print) => print.spaced(["expr", "asKw", "dataType", "format"]),
  cast_format: (print) => print.spaced(["formatKw", "string", "timezone"]),
  cast_format_timezone: (print) => print.spaced(["atTimeZoneKw", "timezone"]),
  raise_expr: (print) => print(["raiseKw", "args"]),
  raise_expr_type: (print) => print("typeKw"),
  extract_expr: (print) => print(["extractKw", "args"]),
  extract_from: (print) => print.spaced(["unit", "fromKw", "expr"]),
  week_expr: (print) => print(["weekKw", "args"]),
  interval_expr: (print) => print.spaced(["intervalKw", "expr", "unit"]),
  interval_unit_range: (print) => print.spaced(["fromUnit", "toKw", "toUnit"]),
  interval_unit: (print) => print("unitKw"),
  array_expr: (print) =>
    group(["[", indent([softline, print("expr")]), softline, "]"]),
  struct_expr: (print) =>
    group(["(", indent([softline, print("expr")]), softline, ")"]),
  typed_expr: (print) => print(["dataType", "expr"]),
  number_literal: (print) => print("text"),
  boolean_literal: (print) => print("valueKw"),
  string_literal: (print) => print("text"),
  null_literal: (print) => print("nullKw"),
  numeric_literal: (print) => print.spaced(["numericKw", "string"]),
  bignumeric_literal: (print) => print.spaced(["bignumericKw", "string"]),
  date_literal: (print) => print.spaced(["dateKw", "string"]),
  time_literal: (print) => print.spaced(["timeKw", "string"]),
  datetime_literal: (print) => print.spaced(["datetimeKw", "string"]),
  timestamp_literal: (print) => print.spaced(["timestampKw", "string"]),
  json_literal: (print) => print.spaced(["jsonKw", "string"]),
  identifier: (print) => print("text"),
  variable: (print) => print("text"),
  parameter: (print) => print("text"),
};

const isBooleanOp = ({ name }: Keyword) => name === "AND" || name === "OR";
