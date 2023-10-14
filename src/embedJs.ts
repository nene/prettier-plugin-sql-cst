// import { Printer } from "prettier";
// import { CreateFunctionStmt, Node } from "sql-parser-cst";
// import {
//   isAsClause,
//   isCreateFunctionStmt,
//   isLanguageClause,
//   isStringLiteral,
// } from "./node_utils";
// import { hardline, indent, stripTrailingHardline } from "./print_utils";

// export const embedJs: NonNullable<Printer<Node>["embed"]> = (
//   path,
//   print,
//   textToDoc,
//   options
// ) => {
//   const node = path.getValue();
//   const parent = path.getParentNode(0);
//   const grandParent = path.getParentNode(1);
//   if (
//     isStringLiteral(node) &&
//     isAsClause(parent) &&
//     isCreateFunctionStmt(grandParent) &&
//     grandParent.clauses.some(isJavaScriptLanguageClause)
//   ) {
//     const quotes = detectQuotes(node.value);
//     if (!quotes) {
//       // Give up for now. Don't format JavaScript inside the string.
//       // Perhaps tackle this corner-case in the future.
//       return null;
//     }

//     const js = textToDoc(node.value, {
//       ...options,
//       parser: "babel",
//     });

//     return [
//       quotes[0],
//       indent([hardline, stripTrailingHardline(js)]),
//       hardline,
//       quotes[1],
//     ];
//   }
//   return null;
// };

// const isJavaScriptLanguageClause = (
//   clause: CreateFunctionStmt["clauses"][0]
// ): boolean => isLanguageClause(clause) && clause.name.name === "js";

// // Whether to quote the code with single- or double-quotes.
// // Returns undefined when neither can be used without escaping.
// const detectQuotes = (js: string): [string, string] | undefined => {
//   if (!/'''/.test(js)) {
//     return ["r'''", "'''"];
//   }
//   if (!/"""/.test(js)) {
//     return ['r"""', '"""'];
//   }
//   return undefined;
// };
