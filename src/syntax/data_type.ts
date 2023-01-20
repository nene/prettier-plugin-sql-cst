import { AllDataTypeNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";

export const dataTypeMap: Partial<CstToDocMap<AllDataTypeNodes>> = {
  data_type: (print) => [print.spaced("nameKw"), ...print(["params"])],
};
