import { doc, Parser, Printer } from "prettier";

type Part = { type: "sql" | "command"; text: string; start: number };
type Script = { type: "script"; parts: Part[]; text: string };
type PsqlNode = Script | Part;

const { join, literalline } = doc.builders;
const literal = (text: string) => join(literalline, text.split("\n"));

// Only split outside SQL strings, identifiers and comments. A command owns
// the rest of its line, including quotes and backslashes in its arguments.
const splitScript = (text: string): Part[] => {
  const parts: Part[] = [];
  let start = 0;
  let pos = 0;
  while (pos < text.length) {
    if (pos === 0 || text[pos - 1] === "\n") {
      const command = text.slice(pos).match(/^[\t ]*\\[^\n]*(?:\n|$)/);
      if (command) {
        if (pos > start) {
          parts.push({ type: "sql", text: text.slice(start, pos), start });
        }
        parts.push({ type: "command", text: command[0], start: pos });
        pos += command[0].length;
        start = pos;
        continue;
      }
    }
    if (text.startsWith("--", pos)) {
      const end = text.indexOf("\n", pos);
      pos = end < 0 ? text.length : end;
    } else if (text.startsWith("/*", pos)) {
      let depth = 1;
      pos += 2;
      while (pos < text.length && depth) {
        if (text.startsWith("/*", pos)) {
          depth++;
          pos += 2;
        } else if (text.startsWith("*/", pos)) {
          depth--;
          pos += 2;
        } else {
          pos++;
        }
      }
    } else if (text[pos] === "'" || text[pos] === '"') {
      const quote = text[pos];
      const escapes =
        quote === "'" && /(?:^|[^\w$])[eE]$/.test(text.slice(0, pos));
      pos++;
      while (pos < text.length) {
        if (escapes && text[pos] === "\\") {
          pos += 2;
        } else if (text[pos++] === quote) {
          if (text[pos] !== quote) break;
          pos++;
        }
      }
    } else {
      const dollar =
        text[pos] === "$" &&
        !/[\w$\u0080-\uffff]/.test(text[pos - 1] || "") &&
        text
          .slice(pos)
          .match(/^\$(?:[a-zA-Z_\u0080-\uffff][\w\u0080-\uffff]*)?\$/);
      if (dollar) {
        const end = text.indexOf(dollar[0], pos + dollar[0].length);
        pos = end < 0 ? text.length : end + dollar[0].length;
      } else {
        pos++;
      }
    }
  }
  if (start < text.length) {
    parts.push({ type: "sql", text: text.slice(start), start });
  }
  return parts;
};

export const psqlParser: Parser<PsqlNode> = {
  parse: (text) => ({
    type: "script",
    text,
    // COPY input is data, not SQL. Until we can parse its boundaries, leave
    // scripts mentioning COPY untouched (including possible false positives).
    parts: /\bcopy\b/i.test(text)
      ? [{ type: "command", text, start: 0 }]
      : splitScript(text),
  }),
  astFormat: "psql",
  locStart: (node) => (node.type === "script" ? 0 : node.start),
  locEnd: (node) =>
    (node.type === "script" ? 0 : node.start) + node.text.length,
};

export const psqlPrinter: Printer<PsqlNode> = {
  print: (path, options, print) =>
    path.node.type === "script"
      ? path.map(print, "parts")
      : literal(path.node.text),
  embed: (path) => {
    const node = path.node;
    if (node.type !== "sql" || !node.text.trim()) return null;
    return async (textToDoc) => {
      const prefix = node.text.match(/^\s*/)?.[0] || "";
      const suffix = node.text.match(/\s*$/)?.[0] || "";
      return [
        literal(prefix.replace(/[^\n]/g, "")),
        await textToDoc(node.text.trim(), {
          parser: "postgresql",
          // A semicolon before e.g. \\gset would execute the query twice.
          sqlFinalSemicolon: false,
        } as Parameters<typeof textToDoc>[1]),
        literal(suffix.replace(/[^\n]/g, "")),
      ];
    };
  },
};
