// import { Printer } from "prettier";
// import { Node, StringLiteral } from "sql-parser-cst";
// import { isJsonLiteral, isStringLiteral } from "./node_utils";
// import {
//   ifBreak,
//   indent,
//   softline,
//   stripTrailingHardline,
// } from "./print_utils";

// export const embedJson: NonNullable<Printer<Node>["embed"]> = (
//   path,
//   print,
//   textToDoc,
//   options
// ) => {
//   const node = path.getValue();
//   const parent = path.getParentNode();
//   if (isStringLiteral(node) && isJsonLiteral(parent)) {
//     if (
//       containsTripleQuote(node.value) ||
//       containsBackslash(node.value) ||
//       isRawString(node)
//     ) {
//       // Give up for now. Don't format JSON inside the string.
//       // Tackle these corner-case in the future.
//       return null;
//     }
//     const json = textToDoc(node.value, {
//       ...options,
//       parser: "json",
//     });
//     const inlineQuote = containsSingleQuote(node.value) ? "'''" : "'";
//     return [
//       ifBreak("'''", inlineQuote),
//       indent([softline, stripTrailingHardline(json)]),
//       softline,
//       ifBreak("'''", inlineQuote),
//     ];
//   }
//   return null;
// };

// const containsSingleQuote = (json: string) => /'/.test(json);

// const containsTripleQuote = (json: string) => /'''/.test(json);
// const containsBackslash = (json: string) => /\\/.test(json);
// const isRawString = (node: StringLiteral) => /^R/i.test(node.text);
