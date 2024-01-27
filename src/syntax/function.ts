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
  function_param: (print) => print.spaced(["mode", "name", "dataType"]),
  drop_function_stmt: (print) =>
    print.spaced(["dropKw", "tableKw", "functionKw", "ifExistsKw", "name"]),
};

const hasOnlyAsClause = (node: CreateFunctionStmt): boolean =>
  node.clauses.length === 1 && isAsClause(node.clauses[0]);
