import { AllDataTypeNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { join } from "../print_utils";

export const dataTypeMap: Partial<CstToDocMap<AllDataTypeNodes>> = {
  data_type: (print) => [join(" ", print("nameKw")), print(["params"])],
};
