import { AllPublicationNodes } from "sql-parser-cst";
import { group, indent, line } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const publicationMap: Partial<CstToDocMap<AllPublicationNodes>> = {
  create_publication_stmt: (print) =>
    group(print.spaced(["createPublicationKw", "name", "clauses"])),
  for_publication_objects_clause: (print) =>
    group([print("forKw"), indent([line, print("publicationObjects")])]),
  all_publication_object: (print) => group(print.spaced(["allKw", "typesKw"])),
  publication_object_table: (print) =>
    group(print.spaced(["tableKw", "table", "columns", "where"])),
  publication_object_tables_in_schema: (print) =>
    group(print.spaced(["tablesInSchemaKw", "schema"])),
};
