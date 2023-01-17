import { AllConstraintNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { join } from "../print_utils";

export const constraintMap: Partial<CstToDocMap<AllConstraintNodes>> = {
  constraint_not_null: (print) => join(" ", print("notNullKw")),
};
