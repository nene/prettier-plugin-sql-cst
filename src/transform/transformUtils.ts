import { Keyword } from "sql-parser-cst";

export function keyword<T extends string>(name: T): Keyword<T> {
  return { type: "keyword", name, text: name };
}
