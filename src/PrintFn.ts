import { AstPath, Doc } from "prettier";
import { Node } from "sql-parser-cst";

export type OldPrintFn = (path: AstPath<Node> | string) => Doc;

export type PrintFn<T> = {
  (path: AstPath<Node>): Doc;
  (path: Exclude<keyof T, ReservedKey>): Doc;
  (path: Exclude<keyof T, ReservedKey>[]): Doc[];
};

// Keys of Node objects that have special meaning
type ReservedKey = "type" | "range" | "leading" | "trailing";
