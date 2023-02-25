import { AllBigqueryNodes } from "sql-parser-cst";
import { hardline, join } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const bigqueryMap: Partial<CstToDocMap<AllBigqueryNodes>> = {
  bigquery_options: (print) => print(["optionsKw", "options"]),
  bigquery_option_default_collate: (print) =>
    print.spaced(["defaultCollateKw", "collation"]),
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
      ...print.spaced(["grantTo"]),
      print.spaced(["filterUsingKw", "filterExpr"]),
    ]),
  row_access_policy_grant: (print) => print.spaced(["grantToKw", "grantees"]),
};
