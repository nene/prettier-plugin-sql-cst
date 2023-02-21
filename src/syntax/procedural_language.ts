import { AllProceduralNodes } from "sql-parser-cst";
import { hardline, indent, stripTrailingHardline } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const proceduralLanguageMap: Partial<CstToDocMap<AllProceduralNodes>> = {
  block_stmt: (print) => [
    print("beginKw"),
    indent([hardline, stripTrailingHardline(print("program"))]),
    hardline,
    print("endKw"),
  ],
};
