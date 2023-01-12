import { doc, AstPath, Doc } from "prettier";

export const { join, line, softline, indent, group, lineSuffix } = doc.builders;

export type PrintFnFor<T> = (path: AstPath<T> | string) => Doc;
