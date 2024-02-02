import { AllPostgresqlNodes } from "sql-parser-cst";
import { CstToDocMap } from "../../CstToDocMap";

export const postgresqlMap: Partial<CstToDocMap<AllPostgresqlNodes>> = {
  postgresql_operator_expr: (print) => print(["operatorKw", "expr"]),
  postgresql_operator: (print) => print("operator"),
  postgresql_operator_class: (print) => print("name"),
  postgresql_with_options: (print) => print.spaced(["withKw", "options"]),
};
