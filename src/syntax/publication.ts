import { AllPublicationNodes } from "sql-parser-cst";
import { group, indent, line } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const publicationMap: CstToDocMap<AllPublicationNodes> = {
  create_publication_stmt: (print, node) =>
    group([
      print.spaced(["createPublicationKw", "name"]),
      print("clauses").map((printedClause, i) => {
        if (node.clauses[i].type === "for_publication_objects_clause") {
          return [" ", printedClause];
        } else {
          return [line, printedClause];
        }
      }),
    ]),
  for_publication_objects_clause: (print) =>
    group([print("forKw"), indent([line, print("publicationObjects")])]),
  all_publication_object: (print) => group(print.spaced(["allKw", "typesKw"])),
  publication_object_table: (print) =>
    group(print.spaced(["tableKw", "table", "columns", "where"])),
  publication_object_tables_in_schema: (print) =>
    group(print.spaced(["tablesInSchemaKw", "schema"])),

  alter_publication_stmt: (print) =>
    group([
      print.spaced(["alterPublicationKw", "name"]),
      print.dynamicLine(),
      print("action"),
    ]),
  alter_action_add_publication_objects: (print) =>
    group([print("addKw"), indent([line, print("publicationObjects")])]),
  alter_action_set_publication_objects: (print) =>
    group([print("setKw"), indent([line, print("publicationObjects")])]),
  alter_action_drop_publication_objects: (print) =>
    group([print("dropKw"), indent([line, print("publicationObjects")])]),

  drop_publication_stmt: (print) =>
    group(
      print.spaced(["dropPublicationKw", "ifExistsKw", "names", "behaviorKw"]),
    ),
};
