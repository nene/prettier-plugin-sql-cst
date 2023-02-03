import { AllDataTypeNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";

export const dataTypeMap: Partial<CstToDocMap<AllDataTypeNodes>> = {
  data_type: (print) => [print.spaced("nameKw"), ...print(["params"])],
  generic_type_params: (print) => ["<", print("params"), ">"],
  array_type_param: (print) => print("dataType"),
};
