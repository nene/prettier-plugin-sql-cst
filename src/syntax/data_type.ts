import { AllDataTypeNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { join } from "../print_utils";

export const dataTypeMap: Partial<CstToDocMap<AllDataTypeNodes>> = {
  // explicitly have no space between type name and parameters
  data_type: (print) =>
    join("", [print.spaced("nameKw"), ...print(["params"])]),
};
