import { cstVisitor, Keyword, Program } from "sql-parser-cst";
import { AllPrettierOptions } from "src/options";

export const canonicOperators = (
  cst: Program,
  originalText: string,
  options: AllPrettierOptions,
): Program => {
  cstVisitor({
    binary_expr: (node) => {
      // Replaces <> operator with !=
      if (node.operator === "<>") {
        node.operator = "!=";
      }

      // Replace MySQL && and || operators with AND and OR
      if (options.parser === "mysql" || options.parser === "mariadb") {
        if (node.operator === "&&") {
          node.operator = keyword("AND");
        }
        if (node.operator === "||") {
          node.operator = keyword("OR");
        }
      }
    },
    // Replaces PostgreSQL deprecated := operator with =>
    named_arg: (node) => {
      if (node.operator === ":=") {
        node.operator = "=>";
      }
    },
  })(cst);

  return cst;
};

function keyword<T extends string>(name: T): Keyword<T> {
  return { type: "keyword", name, text: name };
}
