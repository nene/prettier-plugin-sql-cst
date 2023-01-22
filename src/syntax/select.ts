import { AllSelectNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { join, line, indent, group } from "../print_utils";

export const selectMap: Partial<CstToDocMap<AllSelectNodes>> = {
  select_stmt: (print) => group(join(line, print("clauses"))),
  select_clause: (print) =>
    group([print("selectKw"), indent([line, print("columns")])]),
  from_clause: (print) =>
    group([print("fromKw"), indent([line, print("expr")])]),
  join_expr: (print, node) => [
    print("left"),
    line,
    group(
      join(" ", [
        print.spaced("operator"),
        [
          print("right"),
          node.specification ? indent([line, print(["specification"])]) : [],
        ],
      ])
    ),
  ],
  join_on_specification: (print) => group(print.spaced(["onKw", "expr"])),
  join_using_specification: (print) => group(print.spaced(["usingKw", "expr"])),
  where_clause: (print) =>
    group([print("whereKw"), indent([line, print("expr")])]),
  order_by_clause: (print) =>
    group([print.spaced("orderByKw"), indent([line, print("specifications")])]),
  group_by_clause: (print) =>
    group([print.spaced("groupByKw"), indent([line, print("columns")])]),
  having_clause: (print) =>
    group([print("havingKw"), indent([line, print("expr")])]),
  returning_clause: (print) =>
    group([print("returningKw"), indent([line, print("columns")])]),
  sort_specification: (print) => print.spaced(["expr", "orderKw"]),
};
