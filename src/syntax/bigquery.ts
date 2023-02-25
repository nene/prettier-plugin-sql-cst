import { AllBigqueryNodes } from "sql-parser-cst";
import { hardline, join } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const bigqueryMap: Partial<CstToDocMap<AllBigqueryNodes>> = {
  bigquery_options: (print) => print(["optionsKw", "options"]),
  bigquery_option_default_collate: (print) =>
    print.spaced(["defaultCollateKw", "collation"]),

  // ROW ACCESS POLICY
  create_row_access_policy_stmt: (print) =>
    join(hardline, [
      print.spaced([
        "createKw",
        "orReplaceKw",
        "rowAccessPolicyKw",
        "ifNotExistsKw",
        "name",
        "onKw",
        "table",
      ]),
      ...print("clauses"),
    ]),
  row_access_policy_grant_clause: (print) =>
    print.spaced(["grantToKw", "grantees"]),
  row_access_policy_filter_clause: (print) =>
    print.spaced(["filterUsingKw", "expr"]),
  drop_row_access_policy_stmt: (print) =>
    print.spaced([
      "dropKw",
      "allKw",
      "rowAccessPolicyKw",
      "ifExistsKw",
      "name",
      "onKw",
      "table",
    ]),

  // CAPACITY
  create_capacity_stmt: (print) => [
    print.spaced(["createKw", "capacityKw", "name"]),
    hardline,
    print("options"),
  ],
  drop_capacity_stmt: (print) =>
    print.spaced(["dropKw", "capacityKw", "ifExistsKw", "name"]),
};
