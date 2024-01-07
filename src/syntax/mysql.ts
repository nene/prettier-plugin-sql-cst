import { AllMysqlNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";

export const mysqlMap: CstToDocMap<AllMysqlNodes> = {
  mysql_modifier: (print) => print.spaced("modifierKw"),
};
