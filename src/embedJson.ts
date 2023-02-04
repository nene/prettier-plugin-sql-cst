import { Printer } from "prettier";
import { Node } from "sql-parser-cst";
import { isJsonLiteral, isStringLiteral } from "./node_utils";
import {
  ifBreak,
  indent,
  softline,
  stripTrailingHardline,
} from "./print_utils";

export const embedJson: Printer<Node>["embed"] = (
  path,
  print,
  textToDoc,
  options
) => {
  const node = path.getValue();
  const parent = path.getParentNode();
  if (isStringLiteral(node) && isJsonLiteral(parent)) {
    const json = textToDoc(node.value, {
      ...options,
      parser: "json",
    });
    return [
      ifBreak("'''", "'"),
      indent([softline, stripTrailingHardline(json)]),
      softline,
      ifBreak("'''", "'"),
    ];
  }
  return null;
};
