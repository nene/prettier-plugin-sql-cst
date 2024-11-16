import { AllTypeNodes } from "sql-parser-cst";
import { group, hardline, indent, join, line } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const typeMap: Partial<CstToDocMap<AllTypeNodes>> = {
  create_type_stmt: (print) =>
    group([print.spaced(["createTypeKw", "name", "definition"])]),
  composite_type_definition: (print) =>
    group(print.spaced(["asKw", "columns"])),
  enum_type_definition: (print) => group(print.spaced(["asEnumKw", "values"])),
  alter_type_stmt: (print, node) =>
    group([
      print.spaced(["alterTypeKw", "name"]),
      print.dynamicLine(),
      print("actions"),
    ]),
  drop_type_stmt: (print) =>
    group(print.spaced(["dropTypeKw", "ifExistsKw", "types", "behaviorKw"])),
};
