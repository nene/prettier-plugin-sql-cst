import { AllInsertNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { join, line, group, hardline, indent } from "../print_utils";

export const insertMap: Partial<CstToDocMap<AllInsertNodes>> = {
  insert_stmt: (print) => join(hardline, print("clauses")),
  insert_clause: (print, path) => {
    const node = path.getValue();
    return group([
      join(" ", print(["insertKw", "intoKw", "table"])),
      node.columns ? indent([line, print("columns")]) : [],
    ]);
  },
  values_clause: (print) =>
    group([print("valuesKw"), indent([line, print("values")])]),
};
