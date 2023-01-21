import { AllConstraintNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { group, indent, line } from "../print_utils";

export const constraintMap: Partial<CstToDocMap<AllConstraintNodes>> = {
  constraint: (print, node) => {
    if (node.name) {
      return group([print("name"), indent([line, print("constraint")])]);
    } else {
      return print("constraint");
    }
  },
  constraint_name: (print) => print.spaced(["constraintKw", "name"]),
  constraint_not_null: (print) =>
    group(print.spaced(["notNullKw", "onConflict"])),
  constraint_default: (print) => group(print.spaced(["defaultKw", "expr"])),
  constraint_primary_key: (print) =>
    group(print.spaced(["primaryKeyKw", "orderKw", "columns", "onConflict"])),
  constraint_unique: (print) =>
    group(print.spaced(["uniqueKw", "columns", "onConflict"])),
  constraint_check: (print) => group(print.spaced(["checkKw", "expr"])),
  constraint_collate: (print) =>
    group(print.spaced(["collateKw", "collation"])),
  constraint_foreign_key: (print) =>
    group(print.spaced(["foreignKeyKw", "columns", "references"])),
  references_specification: (print) =>
    print.spaced(["referencesKw", "table", "columns"]),
  constraint_generated: (print) =>
    print.spaced(["generatedKw", "asKw", "expr", "storageKw"]),
  constraint_auto_increment: (print) => print("autoIncrementKw"),
  on_conflict_clause: (print) => print.spaced(["onConflictKw", "resolutionKw"]),
};
