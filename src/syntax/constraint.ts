import { AllConstraintNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { group, join, indent, line } from "../print_utils";

export const constraintMap: Partial<CstToDocMap<AllConstraintNodes>> = {
  constraint: (print, node) => {
    if (node.name) {
      return group([print("name"), indent([line, print("constraint")])]);
    } else {
      return print("constraint");
    }
  },
  constraint_name: (print) => join(" ", print(["constraintKw", "name"])),
  constraint_not_null: (print) => group(print.kw("notNullKw")),
  constraint_default: (print) => group(join(" ", print(["defaultKw", "expr"]))),
  constraint_primary_key: (print) =>
    group(
      join(" ", [print.kw(["primaryKeyKw", "orderKw"]), ...print(["columns"])])
    ),
  constraint_unique: (print) =>
    group(join(" ", [...print.kw("uniqueKw"), ...print(["columns"])])),
  constraint_check: (print) => group(join(" ", print(["checkKw", "expr"]))),
  constraint_collate: (print) =>
    group(join(" ", print(["collateKw", "collation"]))),
  constraint_foreign_key: (print) =>
    group(
      join(" ", [...print("foreignKeyKw"), ...print(["columns", "references"])])
    ),
  references_specification: (print) =>
    join(" ", print(["referencesKw", "table", "columns"])),
  constraint_generated: (print) => {
    return join(" ", [
      print.kw(["generatedKw", "asKw"]),
      ...print(["expr", "storageKw"]),
    ]);
  },
  constraint_auto_increment: (print) => print("autoIncrementKw"),
};
