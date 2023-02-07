import { AllDataTypeNodes } from "sql-parser-cst";
import { isArray } from "../utils";
import { CstToDocMap } from "../CstToDocMap";

export const dataTypeMap: Partial<CstToDocMap<AllDataTypeNodes>> = {
  // print single-word types as `TYPE(10)` and multi-word types as `MY TYPE (10)`
  data_type: (print, node) =>
    (isArray(node.nameKw) ? print.spaced : print)(["nameKw", "params"]),
  generic_type_params: (print) => ["<", print("params"), ">"],
  array_type_param: (print) => print("dataType"),
  struct_type_param: (print) => print.spaced(["name", "dataType"]),
};
