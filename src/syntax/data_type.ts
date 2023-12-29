import { AllDataTypeNodes } from "sql-parser-cst";
import { isArray } from "../utils";
import { CstToDocMap } from "../CstToDocMap";
import { group, indent, softline } from "../print_utils";

export const dataTypeMap: Partial<CstToDocMap<AllDataTypeNodes>> = {
  // print single-word types as `TYPE(10)` and multi-word types as `MY TYPE (10)`
  named_data_type: (print, node) =>
    (isArray(node.nameKw) ? print.spaced : print)(["nameKw", "params"]),
  array_data_type: (print) => print(["dataType", "bounds"]),
  array_bounds: (print) => ["[", print("bounds"), "]"],
  with_time_zone_data_type: (print) =>
    print.spaced(["dataType", "withTimeZoneKw"]),
  generic_type_params: (print) =>
    group(["<", indent([softline, print("params")]), softline, ">"]),
  array_type_param: (print) => print.spaced(["dataType", "constraints"]),
  struct_type_param: (print) =>
    print.spaced(["name", "dataType", "constraints"]),
};
