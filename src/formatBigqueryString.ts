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
    const quotes = detectQuotes(node.text);
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

// Returns the pair of quotes, like [r''', ''']
// Returns undefined when not dealing with raw triple-quoted strings.
const detectQuotes = (code: string): [string, string] | undefined => {
  const match = code.match(/^([rR])('''|""")/);
  if (!match) {
    return undefined;
  }
  return [match[0], match[2]];
};
