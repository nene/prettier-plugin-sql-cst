import { Doc, doc } from "prettier";
import { isArray } from "./utils";

export const { line, hardline, softline, indent, group, lineSuffix } =
  doc.builders;

const { join: origJoin } = doc.builders;

/** Improved join() that also accepts a non-array docs parameter */
export const join = (sep: Doc, docs: Doc): Doc =>
  isArray(docs) ? origJoin(sep, docs) : docs;
