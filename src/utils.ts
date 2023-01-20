import { Node } from "sql-parser-cst";

export const isDefined = <T>(value: T | undefined): value is T =>
  value !== undefined;

export const isString = (value: any): value is string =>
  typeof value === "string";

export const isObject = (x: any): x is Record<string, any> =>
  typeof x === "object" && x !== null && !(x instanceof Array);

export const isArray = (x: any): x is any[] => Array.isArray(x);

export const isEmptyArray = (x: any): x is [] => isArray(x) && x.length === 0;

export const isNode = (value: any): value is Node =>
  isObject(value) && isString(value.type) && !isCommentType(value.type);

const isCommentType = (type: string) =>
  type === "block_comment" || type === "line_comment";

export const arrayWrap = <T>(x: T | T[]): T[] => (isArray(x) ? x : [x]);
