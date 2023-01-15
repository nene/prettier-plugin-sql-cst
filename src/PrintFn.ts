import { AstPath, Doc } from "prettier";
import { Node } from "sql-parser-cst";

export type PrintFn<T> = (
  path:
    | AstPath<Node>
    | Exclude<keyof T, ReservedKey>
    | Exclude<keyof T, ReservedKey>[]
) => Doc;

// Keys of Node objects that have special meaning
type ReservedKey = "type" | "range" | "leading" | "trailing";
