import { AstPath, Doc } from "prettier";
import { Node } from "sql-parser-cst";

export type OldPrintFn = (path: AstPath<Node> | string) => Doc;

export type PrintFn<T, K = Exclude<keyof T, ReservedKey>> = {
  (path: AstPath<Node>): Doc;
  // when field "x" in print("x") refers to an array
  (path: K extends keyof T ? (T[K] extends any[] ? K : never) : never): Doc[];
  // when print("x")
  (path: K): Doc;
  // when print(["x", "y", "z"])
  (path: K[]): Doc[];
};

// Keys of Node objects that have special meaning
type ReservedKey = "type" | "range" | "leading" | "trailing";
