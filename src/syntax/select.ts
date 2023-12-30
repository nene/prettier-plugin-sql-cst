import { Doc } from "prettier";
import { AllSelectNodes, LimitClause } from "sql-parser-cst";
import { PrintFn } from "../PrintFn";
import { isDefined } from "../utils";
import { CstToDocMap } from "../CstToDocMap";
import {
  join,
  line,
  hardline,
  indent,
  group,
  containsNewline,
  breakParent,
} from "../print_utils";

export const selectMap: Partial<CstToDocMap<AllSelectNodes>> = {
  compound_select_stmt: (print) =>
    join(hardline, [print("left"), print.spaced("operator"), print("right")]),
  select_stmt: (print, node, path, opts) => {
    const lineType = containsNewline(node, opts) ? hardline : line;
    return group(join(lineType, print("clauses")));
  },
  with_clause: (print) =>
    group([
      print.spaced(["withKw", "recursiveKw"]),
      indent([line, print("tables")]),
    ]),
  common_table_expr: (print) => [
    print(["table", "columns"]),
    " ",
    print.spaced(["asKw", "materializedKw", "expr"]),
  ],
  select_clause: (print, node, path, opts) =>
    group([
      print.spaced(["selectKw", "distinctKw", "hints", "asStructOrValueKw"]),
      node.columns ? indent([line, print("columns")]) : [],
      containsNewline(node, opts) ? breakParent : [],
    ]),
  except_columns: (print) => print.spaced(["expr", "exceptKw", "columns"]),
  replace_columns: (print) => print.spaced(["expr", "replaceKw", "columns"]),
  from_clause: (print) =>
    group([print("fromKw"), indent([line, print("expr")])]),
  join_expr: (print, node) => {
    if (node.operator === ",") {
      return join([",", hardline], print(["left", "right"]));
    } else {
      return [
        print("left"),
        hardline,
        group(
          join(" ", [
            print.spaced("operator"),
            [
              print("right"),
              node.specification
                ? indent([line, print(["specification"])])
                : [],
            ],
          ]),
        ),
      ];
    }
  },
  join_on_specification: (print) => group(print.spaced(["onKw", "expr"])),
  join_using_specification: (print) => group(print.spaced(["usingKw", "expr"])),
  indexed_table: (print) => print.spaced(["table", "indexedByKw", "index"]),
  not_indexed_table: (print) => print.spaced(["table", "notIndexedKw"]),
  unnest_expr: (print) => print(["unnestKw", "expr"]),
  unnest_with_offset_expr: (print) => print.spaced(["unnest", "withOffsetKw"]),
  pivot_expr: (print) => [print("left"), hardline, print(["pivotKw", "args"])],
  pivot_for_in: (print) =>
    group(
      join(line, [
        group(print("aggregations")),
        print.spaced(["forKw", "inputColumn"]),
        print.spaced(["inKw", "pivotColumns"]),
      ]),
    ),
  unpivot_expr: (print, node) => [
    print("left"),
    hardline,
    (node.nullHandlingKw ? print.spaced : print)([
      "unpivotKw",
      "nullHandlingKw",
      "args",
    ]),
  ],
  unpivot_for_in: (print) =>
    group(
      join(line, [
        print("valuesColumn"),
        print.spaced(["forKw", "nameColumn"]),
        print.spaced(["inKw", "unpivotColumns"]),
      ]),
    ),
  tablesample_expr: (print) =>
    group([print("left"), line, print.spaced(["tablesampleKw", "args"])]),
  tablesample_percent: (print) => print.spaced(["percent", "percentKw"]),
  for_system_time_as_of_expr: (print) =>
    group([print("left"), line, print.spaced(["forSystemTimeAsOfKw", "expr"])]),
  where_clause: (print) =>
    group([print("whereKw"), indent([line, print("expr")])]),
  order_by_clause: (print) =>
    group([print.spaced("orderByKw"), indent([line, print("specifications")])]),
  group_by_clause: (print) =>
    group([print.spaced("groupByKw"), indent([line, print("columns")])]),
  group_by_rollup: (print) => print(["rollupKw", "columns"]),
  partition_by_clause: (print) =>
    group([
      print.spaced("partitionByKw"),
      indent([line, print("specifications")]),
    ]),
  cluster_by_clause: (print) =>
    group([print.spaced("clusterByKw"), indent([line, print("columns")])]),
  having_clause: (print) =>
    group([print("havingKw"), indent([line, print("expr")])]),
  qualify_clause: (print) =>
    group([print("qualifyKw"), indent([line, print("expr")])]),
  returning_clause: (print) =>
    group([print("returningKw"), indent([line, print("columns")])]),
  limit_clause: (print, node) =>
    group([print("limitKw"), indent([line, printLimitValues(print, node)])]),
  sort_specification: (print) =>
    print.spaced(["expr", "orderKw", "nullHandlingKw"]),
  window_clause: (print, node) => {
    const lineType = node.namedWindows.items.length > 1 ? hardline : line;
    return group([
      print("windowKw"),
      indent([lineType, print("namedWindows")]),
    ]);
  },
  named_window: (print) => print.spaced(["name", "asKw", "window"]),
  window_definition: (print, node) => {
    const itemCount = [
      node.baseWindowName,
      node.partitionBy,
      node.orderBy,
      node.frame,
    ].filter(isDefined).length;
    const lineType = itemCount > 1 ? hardline : line;
    return group(
      join(
        lineType,
        print(["baseWindowName", "partitionBy", "orderBy", "frame"]),
      ),
    );
  },
};

const printLimitValues = (
  print: PrintFn<LimitClause>,
  node: LimitClause,
): Doc => {
  if (node.offsetKw) {
    return print.spaced(["count", "offsetKw", "offset"]);
  } else if (node.offset) {
    return join([",", " "], print(["offset", "count"]));
  } else {
    return print("count");
  }
};
