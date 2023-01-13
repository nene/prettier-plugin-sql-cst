export const isDefined = <T>(value: T | undefined): value is T =>
  value !== undefined;

export const isString = (value: any): value is string =>
  typeof value === "string";
