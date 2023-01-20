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

  // Helper for printing sequence of keywords
  // Automatically inserts spaces between multiple keywords
  kw(path: K): Doc[];
  kw(path: K[]): Doc[];
};

export type PrintableKey<T> = Exclude<keyof T, ReservedKey>;

// Keys of Node objects that have special meaning
type ReservedKey = "type" | "range" | "leading" | "trailing";
