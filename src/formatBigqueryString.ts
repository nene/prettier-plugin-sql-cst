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
    const quotes = detectQuotes(node.value);
    if (!quotes) {
      return undefined;
    }

    const code = await textToDoc(node.value, options);
    return [
      quotes[0],
      indent([hardline, stripTrailingHardline(code)]),
      hardline,
      quotes[1],
    ];
  };
};

// Whether to quote the code with single- or double-quotes.
// Returns undefined when neither can be used without escaping.
const detectQuotes = (code: string): [string, string] | undefined => {
  if (!/'''/.test(code)) {
    return ["r'''", "'''"];
  }
  if (!/"""/.test(code)) {
    return ['r"""', '"""'];
  }
  return undefined;
};
