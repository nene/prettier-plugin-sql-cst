import { Doc } from "prettier";
import { AllConstraintNodes, Constraint } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { PrintFn } from "../PrintFn";
import { group, indent, line, hardline, join } from "../print_utils";

export const constraintMap: Partial<CstToDocMap<AllConstraintNodes>> = {
  constraint: (print, node) => {
    if (node.name) {
      return group([
        print("name"),
        indent([line, printUnnamedConstraint(print, node)]),
      ]);
    } else {
      return printUnnamedConstraint(print, node);
    }
  },
  constraint_name: (print) => print.spaced(["constraintKw", "name"]),
  constraint_deferrable: (print) =>
    print.spaced(["deferrableKw", "initiallyKw"]),
  constraint_null: (print) => print("nullKw"),
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
  references_specification: (print, node) => {
    const baseDoc = print.spaced(["referencesKw", "table", "columns"]);
    if (node.options.length > 0) {
      return group([
        baseDoc,
        indent([hardline, join(hardline, print("options"))]),
      ]);
    } else {
      return baseDoc;
    }
  },
  referential_action: (print) => print.spaced(["onKw", "eventKw", "actionKw"]),
  referential_match: (print) => print.spaced(["matchKw", "typeKw"]),
  constraint_generated: (print) =>
    print.spaced(["generatedKw", "asKw", "expr", "storageKw"]),
  constraint_auto_increment: (print) => print("autoIncrementKw"),
  on_conflict_clause: (print) => print.spaced(["onConflictKw", "resolutionKw"]),
  constraint_comment: (print) => print.spaced(["commentKw", "value"]),
  constraint_index: (print) => print.spaced(["indexKw"]),
  constraint_visible: (print) => print.spaced(["visibleKw"]),
  constraint_column_format: (print) =>
    print.spaced(["columnFormatKw", "formatKw"]),
  constraint_storage: (print) => print.spaced(["storageKw", "typeKw"]),
  constraint_engine_attribute: (print, node) =>
    join(node.hasEq ? " = " : " ", print(["engineAttributeKw", "value"])),
};

const printUnnamedConstraint = <T>(
  print: PrintFn<Constraint<T>>,
  node: Constraint<T>,
): Doc => {
  if (node.deferrable) {
    return group([
      print("constraint"),
      indent([hardline, print("deferrable")]),
    ]);
  } else {
    return print("constraint");
  }
};
