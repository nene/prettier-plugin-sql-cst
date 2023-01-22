import { AllProcClauseNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { hardline, indent } from "../print_utils";

export const procClauseMap: Partial<CstToDocMap<AllProcClauseNodes>> = {
  as_clause: (print) => [print("asKw"), indent([hardline, print("expr")])],
};
