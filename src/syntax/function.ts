import { AllFunctionNodes, CreateFunctionStmt } from "sql-parser-cst";
import { group, hardline, join } from "../print_utils";
import { isAsClause } from "../node_utils";
import { CstToDocMap } from "../CstToDocMap";

export const functionMap: Partial<CstToDocMap<AllFunctionNodes>> = {
  create_function_stmt: (print, node) => [
    print.spaced([
      "createKw",
      "orReplaceKw",
      "temporaryKw",
      "tableKw",
      "functionKw",
      "ifNotExistsKw",
      "name",
    ]),
    print("params"),
    hasOnlyAsClause(node)
      ? [" ", group(print("clauses"))]
      : [
          hardline,
          join(
            hardline,
            print("clauses").map((cls) => group(cls)),
          ),
        ],
  ],
  function_param: (print) =>
    print.spaced(["mode", "name", "dataType", "default"]),
  function_param_default: (print) => print.spaced(["operator", "expr"]),
  return_clause: (print) => print.spaced(["returnKw", "expr"]),
  function_behavior_clause: (print) => print.spaced(["behaviorKw"]),
  function_security_clause: (print) =>
    print.spaced(["externalKw", "securityKw"]),
  function_cost_clause: (print) => print.spaced(["costKw", "cost"]),
  function_rows_clause: (print) => print.spaced(["rowsKw", "rows"]),
  function_support_clause: (print) => print.spaced(["supportKw", "name"]),
  function_window_clause: (print) => print.spaced("windowKw"),
  function_transform_clause: (print) => print.spaced(["transformKw", "types"]),
  transform_type: (print) => print.spaced(["forTypeKw", "dataType"]),
  set_parameter_clause: (print) =>
    print.spaced(["setKw", "name", "operator", "value"]),
  set_parameter_from_current_clause: (print) =>
    print.spaced(["setKw", "name", "fromCurrentKw"]),
  dynamically_loaded_function: (print) =>
    join(", ", print(["objectFile", "symbol"])),
  drop_function_stmt: (print) =>
    group([
      print.spaced(["dropKw", "tableKw", "functionKw", "ifExistsKw", "name"]),
      print.spaced(["params", "behaviorKw"]),
    ]),
};

const hasOnlyAsClause = (node: CreateFunctionStmt): boolean =>
  node.clauses.length === 1 && isAsClause(node.clauses[0]);
