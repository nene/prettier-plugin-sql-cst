import { PsqlCommand, PsqlQuery } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { hardline } from "../print_utils";
import { AllPrettierOptions } from "../options";

export const psqlMap: CstToDocMap<PsqlCommand | PsqlQuery> = {
  psql_command: (print, node, path, options) => {
    const start = node.range?.[0];
    if (start === undefined) {
      return node.text;
    }
    const lineStart = options.originalText.lastIndexOf("\n", start - 1) + 1;
    return options.originalText.slice(lineStart, start) + node.text;
  },
  psql_query: (print, node, path, options) => {
    if (!node.terminator.startsWith("\\")) {
      return [print("query"), node.terminator];
    }

    const queryEnd = node.query.range?.[1] ?? node.range?.[0] ?? 0;
    const trailingEnd = (node.query.trailing ?? []).reduce(
      (end, comment) => Math.max(end, comment.range?.[1] ?? end),
      queryEnd,
    );
    const commandStart =
      (node.range?.[1] ?? trailingEnd) - node.terminator.length;
    const gap = options.originalText.slice(trailingEnd, commandStart);
    const lineBreaks = gap.match(/\r\n|\r|\n/g)?.length ?? 0;
    const indentation = gap.slice(
      Math.max(gap.lastIndexOf("\n"), gap.lastIndexOf("\r")) + 1,
    );

    return [
      print("query"),
      ...Array.from({ length: Math.max(lineBreaks, 1) }, () => hardline),
      indentation,
      node.terminator,
    ];
  },
};
