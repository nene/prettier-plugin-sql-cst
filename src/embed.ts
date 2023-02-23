import { Printer } from "prettier";
import { Node } from "sql-parser-cst";
import { embedJs } from "./embedJs";
import { embedJson } from "./embedJson";

export const embed: NonNullable<Printer<Node>["embed"]> = (...args) => {
  return embedJson(...args) || embedJs(...args);
};
