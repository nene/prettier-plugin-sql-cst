import { AllExtensionNodes } from "sql-parser-cst";
import { group, indent, line } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const extensionMap: CstToDocMap<AllExtensionNodes> = {
  create_extension_stmt: (print, node) =>
    group([
      print.spaced(["createExtensionKw", "ifNotExistsKw", "name"]),
      node.clauses.length > 0
        ? indent([line, print.spaced(["withKw", "clauses"])])
        : [],
    ]),

  extension_cascade_clause: (print) => group(print.spaced(["cascadeKw"])),
  extension_schema_clause: (print) => group(print.spaced(["schemaKw", "name"])),
  extension_version_clause: (print) =>
    group(print.spaced(["versionKw", "name"])),

  drop_extension_stmt: (print) =>
    group(
      print.spaced(["dropExtensionKw", "ifExistsKw", "names", "behaviorKw"]),
    ),
};
