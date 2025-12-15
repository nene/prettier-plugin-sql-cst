import { AllDataTypeNodes, DataType } from "sql-parser-cst";
import { isArray } from "../utils";
import { CstToDocMap } from "../CstToDocMap";
import { group, indent, join, softline } from "../print_utils";
import { isDataTypeName } from "../node_utils";

export const dataTypeMap: CstToDocMap<AllDataTypeNodes> = {
  data_type_name: (print) => print.spaced("name"),
  // print single-word types as `TYPE(10)` and multi-word types as `MY TYPE (10)`
  modified_data_type: (print, node) =>
    (isMultiWordTypeName(node.dataType) ? print.spaced : print)([
      "dataType",
      "modifiers",
    ]),

  setof_data_type: (print) => print.spaced(["setofKw", "dataType"]),
  array_data_type: (print) => print(["dataType", "bounds"]),
  array_bounds: (print) => ["[", print("bounds"), "]"],
  time_data_type: (print, node) =>
    group(
      join(" ", [
        print(["timeKw", "precision"]),
        ...(node.timeZoneKw ? [print.spaced("timeZoneKw")] : []),
      ]),
    ),
  interval_data_type: (print) => print.spaced(["intervalKw", "unit"]),
  interval_unit_range: (print) => print.spaced(["fromUnit", "toKw", "toUnit"]),
  interval_unit: (print) => print.spaced(["unitKw", "precision"]),
  parametric_data_type: (print) => print(["typeKw", "params"]),
  generic_type_params: (print) =>
    group(["<", indent([softline, print("params")]), softline, ">"]),
  array_type_param: (print) => print.spaced(["dataType", "constraints"]),
  struct_type_param: (print) =>
    print.spaced(["name", "dataType", "constraints"]),
  table_data_type: (print) => print.spaced(["tableKw", "columns"]),
};

function isMultiWordTypeName(node: DataType): boolean {
  return isDataTypeName(node) && isArray(node.name) && node.name.length > 1;
}
