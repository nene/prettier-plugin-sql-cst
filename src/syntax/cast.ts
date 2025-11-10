import { AllCastNodes } from "sql-parser-cst";
import { group } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const castMap: CstToDocMap<AllCastNodes> = {
  cast_definition: (print) => group(print.spaced(["from", "asKw", "to"])),
};
