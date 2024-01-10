import { AstPath, Doc } from "prettier";
import { Node } from "sql-parser-cst";

export type OldPrintFn = (path: AstPath<Node> | string) => Doc;

export type PrintFn<T, K = PrintableKey<T>> = {
  (path: AstPath<Node>): Doc;
  // when field "x" in print("x") refers to an array
  (path: K extends keyof T ? (T[K] extends any[] ? K : never) : never): Doc[];
  // when print("x")
  (path: K): Doc;
  // when print(["x", "y", "z"])
  (path: K[]): Doc[];

  // Helper for printing space-separated list of docs
  spaced(path: K): Doc[];
  spaced(path: K[]): Doc[];

  // Generic helper for printing something-separeted list of docs.
  // The separator will be applied to the outer items,
  // while the inner items will be space-separated (as in spaced()).
  separated(separator: Doc, path: K): Doc[];
  separated(separator: Doc, path: K[]): Doc[];
};

export type PrintableKey<T> = Exclude<keyof T, ReservedKey>;

// Keys of Node objects that have special meaning
type ReservedKey = "type" | "range" | "leading" | "trailing";
