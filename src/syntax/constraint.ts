import { Doc } from "prettier";
import { AllConstraintNodes, Constraint } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { PrintFn } from "../PrintFn";
import { group, indent, line, hardline, join } from "../print_utils";

export const constraintMap: CstToDocMap<AllConstraintNodes> = {
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
  constraint_modifier: (print) => print.spaced("kw"),
  constraint_null: (print) => print("nullKw"),
  constraint_not_null: (print) => group(print.spaced(["notNullKw", "clauses"])),
  constraint_default: (print) => group(print.spaced(["defaultKw", "expr"])),
  constraint_primary_key: (print) =>
    group(print.spaced(["primaryKeyKw", "direction", "columns", "clauses"])),
  constraint_unique: (print) =>
    group(print.spaced(["uniqueKw", "columns", "nullsKw", "clauses"])),
  constraint_check: (print) =>
    group(print.spaced(["checkKw", "expr", "clauses"])),
  constraint_collate: (print) =>
    group(print.spaced(["collateKw", "collation"])),
  constraint_foreign_key: (print) =>
    group(print.spaced(["foreignKeyKw", "indexName", "columns", "references"])),
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
  index_specification: (print) =>
    print.spaced(["expr", "opclass", "direction", "nullHandlingKw"]),
  referential_action: (print) =>
    print.spaced(["onKw", "eventKw", "actionKw", "columns"]),
  referential_match: (print) => print.spaced(["matchKw", "typeKw"]),
  constraint_generated: (print) =>
    print.spaced(["generatedKw", "asKw", "expr", "storageKw"]),
  identity_column: (print) => print("identityKw"),
  constraint_auto_increment: (print) => print("autoIncrementKw"),
  on_conflict_clause: (print) => print.spaced(["onConflictKw", "resolutionKw"]),
  constraint_comment: (print) => print.spaced(["commentKw", "value"]),
  constraint_index: (print) =>
    print.spaced(["indexTypeKw", "indexKw", "columns"]),
  constraint_visible: (print) => print.spaced(["visibleKw"]),
  constraint_column_format: (print) =>
    print.spaced(["columnFormatKw", "formatKw"]),
  constraint_storage: (print) => print.spaced(["storageKw", "typeKw"]),
  constraint_engine_attribute: (print, node) =>
    join(node.hasEq ? " = " : " ", print(["engineAttributeKw", "value"])),
  constraint_compression: (print) => print.spaced(["compressionKw", "method"]),
  constraint_exclude: (print, node) =>
    group([
      print("excludeKw"),
      indent([
        line,
        join(line, [
          print.separated(line, ["using", "params"]),
          ...print("clauses"),
        ]),
      ]),
    ]),
  exclusion_param: (print) => print.spaced(["index", "withKw", "operator"]),
  index_include_clause: (print) => print.spaced(["includeKw", "columns"]),
  index_tablespace_clause: (print) =>
    print.spaced(["usingIndexTablespaceKw", "name"]),
};

const printUnnamedConstraint = <T>(
  print: PrintFn<Constraint<T>>,
  node: Constraint<T>,
): Doc => {
  if (node.modifiers.length > 0) {
    return group([
      print("constraint"),
      indent([line, print.spaced("modifiers")]),
    ]);
  } else {
    return print("constraint");
  }
};
