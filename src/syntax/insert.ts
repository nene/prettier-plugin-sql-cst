import { AllInsertNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { join, group, hardline, indent } from "../print_utils";

export const insertMap: Partial<CstToDocMap<AllInsertNodes>> = {
  insert_stmt: (print, node) => {
    // When there's a columns clause, we want to indent it,
    // but that only works when there's a newline inside it.
    // So we have to avoid adding a newline before columns clause.
    const columnsClauseIndex = node.clauses.findIndex(
      (clause) => clause.type === "insert_columns_clause",
    );
    if (columnsClauseIndex !== -1) {
      const printedClauses = print("clauses");
      const before = printedClauses.slice(0, columnsClauseIndex);
      const columnsClause = printedClauses[columnsClauseIndex];
      const after = printedClauses.slice(columnsClauseIndex + 1);
      return [
        join(hardline, before),
        columnsClause,
        after.length > 0 ? [hardline, join(hardline, after)] : [],
      ];
    } else {
      return join(hardline, print("clauses"));
    }
  },
  insert_clause: (print) =>
    group([print.spaced(["insertKw", "orAction", "intoKw", "table"])]),
  insert_columns_clause: (print) => indent([hardline, print("columns")]),
  values_clause: (print) =>
    group([print("valuesKw"), indent([hardline, print("values")])]),
  or_alternate_action: (print) => print.spaced(["orKw", "actionKw"]),
  default: (print) => print("defaultKw"),
  default_values: (print) => print.spaced("defaultValuesKw"),
  upsert_clause: (print) =>
    print.spaced(["onConflictKw", "columns", "where", "doKw", "action"]),
  upsert_action_nothing: (print) => print("nothingKw"),
  upsert_action_update: (print) => [
    print("updateKw"),
    indent([hardline, join(hardline, print(["set", "where"]))]),
  ],
  row_alias_clause: (print, node) => [
    print.spaced(["asKw", "rowAlias"]),
    node.columnAliases ? indent([hardline, print("columnAliases")]) : [],
  ],
  on_duplicate_key_update_clause: (print) => [
    print.spaced("onDuplicateKeyUpdateKw"),
    indent([hardline, print("assignments")]),
  ],
};
