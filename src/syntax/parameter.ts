import { AllParameterNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { printLiteral } from "./expr";

export const parameterMap: CstToDocMap<AllParameterNodes> = {
  // SET
  set_parameter_stmt: (print) =>
    print.spaced(["setKw", "modifierKw", "name", "operator", "value"]),
  set_time_zone_parameter_stmt: (print) =>
    print.spaced(["setKw", "modifierKw", "timeZoneKw", "value"]),
  set_parameter_clause: (print) =>
    print.spaced(["setKw", "name", "operator", "value"]),
  local_parameter_value: (print) => print("localKw"),
  set_parameter_from_current_clause: (print) =>
    print.spaced(["setKw", "name", "fromCurrentKw"]),

  // RESET
  reset_parameter_stmt: (print) => print.spaced(["resetKw", "name"]),
  reset_parameter_clause: (print) => print.spaced(["resetKw", "name"]),
  all_parameters: (print) => print("allKw"),

  // SHOW
  show_parameter_stmt: (print) => print.spaced(["showKw", "name"]),

  /** cst-ignore: value */
  boolean_on_off_literal: (print, node, path, options) =>
    printLiteral(node.valueKw, options),
};
