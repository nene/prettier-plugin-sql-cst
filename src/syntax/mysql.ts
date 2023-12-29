import { AllMysqlNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";

export const mysqlMap: Partial<CstToDocMap<AllMysqlNodes>> = {
  mysql_hint: (print) => print.spaced("hintKw"),
};
