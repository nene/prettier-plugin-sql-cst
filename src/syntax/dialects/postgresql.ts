import { AllPostgresqlNodes } from "sql-parser-cst";
import { CstToDocMap } from "../../CstToDocMap";
import { group } from "../../print_utils";
import { printLiteral } from "../expr";

export const postgresqlMap: CstToDocMap<AllPostgresqlNodes> = {
  postgresql_operator_expr: (print) => print(["operatorKw", "expr"]),
  postgresql_operator: (print) => print("operator"),
  postgresql_operator_class: (print) => print.spaced(["name", "options"]),
  postgresql_with_options: (print) =>
    group(print.spaced(["withKw", "options"])),
  postgresql_options: (print) => print.spaced(["optionsKw", "options"]),
  postgresql_option_element: (print) => print.spaced(["name", "value"]),
  /** cst-ignore: value */
  postgresql_boolean_on_off_literal: (print, node, path, options) =>
    printLiteral(node.valueKw, options),
};
