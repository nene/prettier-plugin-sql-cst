import { AllBigqueryNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";

export const bigqueryMap: Partial<CstToDocMap<AllBigqueryNodes>> = {
  bigquery_options: (print) => print(["optionsKw", "options"]),
};
