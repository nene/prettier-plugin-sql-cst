import { Doc } from "prettier";
import { AllConstraintNodes } from "sql-parser-cst";
import { arrayWrap } from "../utils";
import { CstToDocMap } from "../CstToDocMap";
import { group, join, indent, line } from "../print_utils";

export const constraintMap: Partial<CstToDocMap<AllConstraintNodes>> = {
  constraint: (print, path) => {
    const node = path.getValue();
    if (node.name) {
      return group([print("name"), indent([line, print("constraint")])]);
    } else {
      return print("constraint");
    }
  },
  constraint_name: (print) => join(" ", print(["constraintKw", "name"])),
  constraint_not_null: (print) => group(join(" ", print("notNullKw"))),
  constraint_primary_key: (print) =>
    group(join(" ", [...(print("primaryKeyKw") as Doc[]), print("columns")])),
  constraint_unique: (print) =>
    group(join(" ", [...arrayWrap(print("uniqueKw")), print("columns")])),
  constraint_check: (print) => group(join(" ", print(["checkKw", "expr"]))),
  constraint_foreign_key: (print) =>
    group(
      join(" ", [
        ...(print("foreignKeyKw") as Doc[]),
        ...(print(["columns", "references"]) as Doc[]),
      ])
    ),
  references_specification: (print) =>
    join(" ", print(["referencesKw", "table", "columns"])),
};
