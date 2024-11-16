import { AllTypeNodes } from "sql-parser-cst";
import { group } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const typeMap: Partial<CstToDocMap<AllTypeNodes>> = {
  create_type_stmt: (print) =>
    group([print.spaced(["createTypeKw", "name", "definition"])]),
  composite_type_definition: (print) =>
    group(print.spaced(["asKw", "columns"])),
};
