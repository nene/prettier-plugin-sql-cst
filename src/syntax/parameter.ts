import { AllParameterNodes } from "sql-parser-cst/lib/cst/Parameter"; // TODO
import { CstToDocMap } from "../CstToDocMap";

export const parameterMap: Partial<CstToDocMap<AllParameterNodes>> = {
  set_parameter_clause: (print) =>
    print.spaced(["setKw", "name", "operator", "value"]),
  set_parameter_from_current_clause: (print) =>
    print.spaced(["setKw", "name", "fromCurrentKw"]),
  reset_parameter_clause: (print) => print.spaced(["resetKw", "name"]),
  all_parameters: (print) => print("allKw"),
};
