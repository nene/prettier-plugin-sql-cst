import { Doc } from "prettier";
import { AllConstraintNodes } from "sql-parser-cst";
import { arrayWrap } from "../utils";
import { CstToDocMap } from "../CstToDocMap";
import { group, join } from "../print_utils";

export const constraintMap: Partial<CstToDocMap<AllConstraintNodes>> = {
  constraint_not_null: (print) => group(join(" ", print("notNullKw"))),
  constraint_primary_key: (print) =>
    group(join(" ", [...(print("primaryKeyKw") as Doc[]), print("columns")])),
  constraint_unique: (print) =>
    group(join(" ", [...arrayWrap(print("uniqueKw")), print("columns")])),
  constraint_check: (print) => group(join(" ", print(["checkKw", "expr"]))),
};
