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

  // WITH clause
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

  // SELECT clause
  select_clause: (print, node, path, opts) =>
    group([
      print.spaced(["selectKw", "modifiers"]),
      node.columns ? indent([line, print("columns")]) : [],
      containsNewline(node, opts) ? breakParent : [],
    ]),
  select_all: (print) => print.spaced(["allKw"]),
  select_distinct: (print) => print.spaced(["distinctKw"]),
  select_distinct_on: (print) =>
    group([print.spaced(["distinctOnKw", "columns"])]),
  select_as_struct: (print) => print.spaced(["asStructKw"]),
  select_as_value: (print) => print.spaced(["asValueKw"]),
  except_columns: (print) => print.spaced(["expr", "exceptKw", "columns"]),
  replace_columns: (print) => print.spaced(["expr", "replaceKw", "columns"]),

  // FROM clause
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
  table_with_inheritance: (print) => [print("table"), " ", "*"],
  table_without_inheritance: (print) => print.spaced(["onlyKw", "table"]),
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
    group([
      print("left"),
      line,
      print.spaced(["tablesampleKw", "method", "args", "repeatable"]),
    ]),
  tablesample_method: (print) => print.spaced(["methodKw"]),
  tablesample_percent: (print) => print.spaced(["percent", "percentKw"]),
  tablesample_repeatable: (print) => print.spaced(["repeatableKw", "seed"]),
  for_system_time_as_of_expr: (print) =>
    group([print("left"), line, print.spaced(["forSystemTimeAsOfKw", "expr"])]),
  partitioned_table: (print) =>
    print.spaced(["table", "partitionKw", "partitions"]),
  dual_table: (print) => print("dualKw"),
  lateral_derived_table: (print) => print.spaced(["lateralKw", "expr"]),

  // WHERE clause
  where_clause: (print) =>
    group([print("whereKw"), indent([line, print("expr")])]),

  // ORDER BY clause
  order_by_clause: (print, node) =>
    group([
      print.spaced("orderByKw"),
      indent([
        line,
        join(line, [
          print("specifications"),
          ...(node.withRollupKw ? print.spaced("withRollupKw") : []),
        ]),
      ]),
    ]),
  sort_specification: (print) =>
    print.spaced(["expr", "direction", "nullHandlingKw"]),
  sort_direction_asc: (print) => print("ascKw"),
  sort_direction_desc: (print) => print("descKw"),

  // GROUP BY clause
  group_by_clause: (print, node) =>
    group([
      print.spaced(["groupByKw", "distinctKw"]),
      indent([
        line,
        join(line, [
          print("columns"),
          ...(node.withRollupKw ? print.spaced("withRollupKw") : []),
        ]),
      ]),
    ]),
  group_by_rollup: (print) => print(["rollupKw", "columns"]),

  // PARTITION BY clause
  partition_by_clause: (print) =>
    group([
      print.spaced("partitionByKw"),
      indent([line, print("specifications")]),
    ]),

  // CLUSTER BY clause
  cluster_by_clause: (print) =>
    group([print.spaced("clusterByKw"), indent([line, print("columns")])]),

  // HAVING clause
  having_clause: (print) =>
    group([print("havingKw"), indent([line, print("expr")])]),

  // QUALIFY clause
  qualify_clause: (print) =>
    group([print("qualifyKw"), indent([line, print("expr")])]),

  // RETURNING clause
  returning_clause: (print) =>
    group([print("returningKw"), indent([line, print("columns")])]),

  // LIMIT clause
  limit_clause: (print, node) =>
    group([
      print("limitKw"),
      indent([
        line,
        printLimitValues(print, node),
        node.rowsExamined ? [line, print("rowsExamined")] : [],
      ]),
    ]),
  limit_all: (print) => print("allKw"),
  limit_rows_examined: (print) => print.spaced(["rowsExaminedKw", "count"]),

  // OFFSET clause
  offset_clause: (print) =>
    group([
      print("offsetKw"),
      indent([line, print.spaced(["offset", "rowsKw"])]),
    ]),

  // FETCH clause
  fetch_clause: (print) =>
    print.spaced(["fetchKw", "count", "rowsKw", "withTiesKw"]),

  // WINDOW clause
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

  // INTO clause
  into_table_clause: (print) =>
    print.spaced(["intoKw", "temporaryKw", "unloggedKw", "tableKw", "name"]),
  into_variables_clause: (print) =>
    group([print("intoKw"), indent([line, print("variables")])]),
  into_dumpfile_clause: (print) => print.spaced(["intoDumpfileKw", "filename"]),
  into_outfile_clause: (print, node) => {
    const hasOptions = node.charset || node.fields || node.lines;
    return group([
      print.spaced(["intoOutfileKw", "filename"]),
      hasOptions
        ? indent([
            hardline,
            join(hardline, print(["charset", "fields", "lines"])),
          ])
        : [],
    ]);
  },
  outfile_fields: (print) => print.spaced(["fieldsKw", "options"]),
  outfile_lines: (print) => print.spaced(["linesKw", "options"]),
  outfile_option_character_set: (print) =>
    print.spaced(["characterSetKw", "value"]),
  outfile_option_starting_by: (print) =>
    print.spaced(["startingByKw", "value"]),
  outfile_option_terminated_by: (print) =>
    print.spaced(["terminatedByKw", "value"]),
  outfile_option_enclosed_by: (print) =>
    print.spaced(["optionallyKw", "enclosedByKw", "value"]),
  outfile_option_escaped_by: (print) => print.spaced(["escapedByKw", "value"]),

  // FOR clause (locking)
  for_clause: (print, node) =>
    group([
      print.spaced(["forKw", "lockStrengthKw", "tables"]),
      node.waitingKw ? indent([line, print.spaced("waitingKw")]) : [],
    ]),
  for_clause_tables: (print) => [
    print("ofKw"),
    indent([line, print("tables")]),
  ],
  lock_in_share_mode_clause: (print) => print.spaced("lockInShareModeKw"),

  // TABLE clause
  table_clause: (print) => print.spaced(["tableKw", "table"]),
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
