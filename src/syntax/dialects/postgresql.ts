import { AllPostgresqlNodes } from "sql-parser-cst";
import { CstToDocMap } from "../../CstToDocMap";

export const postgresqlMap: CstToDocMap<AllPostgresqlNodes> = {
  postgresql_operator_expr: (print) => print(["operatorKw", "expr"]),
  postgresql_operator: (print) => print("operator"),
};
