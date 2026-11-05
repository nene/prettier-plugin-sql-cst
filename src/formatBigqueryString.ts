import { Doc, Options } from "prettier";
import { StringLiteral } from "sql-parser-cst";
import { AllPrettierOptions } from "./options";
import { hardline, indent, stripTrailingHardline } from "./print_utils";

export const formatBigqueryString = (
  node: StringLiteral,
  options: Partial<AllPrettierOptions>,
) => {
  return async (
    textToDoc: (text: string, options: Options) => Promise<Doc>,
  ) => {
    const match = node.text.match(/^([rR])('''|""")/);
    if (!match) {
      return undefined;
    }

    const code = await textToDoc(node.value, options);
    return [
      match[0],
      indent([hardline, stripTrailingHardline(code)]),
      hardline,
      match[2],
    ];
  };
};
