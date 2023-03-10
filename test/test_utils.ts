import { format } from "prettier";
import { DialectName } from "sql-parser-cst";
import * as plugin from "../src/index";
import { SqlPluginOptions } from "../src/options";

interface PrettyOptions extends Partial<SqlPluginOptions> {
  printWidth?: number;
}

interface TestOptions extends PrettyOptions {
  dialect?: DialectName;
}

export const rawPretty = (sql: string, opts: TestOptions = {}): string => {
  return format(sql, {
    parser: opts.dialect ?? "sqlite",
    plugins: [plugin],
    ...opts,
  });
};

export const pretty = (sql: string, opts: TestOptions = {}): string => {
  const formatted = rawPretty(sql, opts);
  if (!/;\n$/.test(formatted)) {
    throw new Error(
      `Expected semicolon and newline at the end of:\n${formatted}`
    );
  }
  return formatted.replace(/;\n$/, "");
};

export const rawTest = (sql: string, opts: TestOptions = {}): void => {
  expect(rawPretty(sql, opts)).toBe(sql);
};

export const test = (sql: string, opts: TestOptions = {}): void => {
  expect(pretty(sql, opts)).toBe(sql);
};

export const testBigquery = (sql: string, opts: TestOptions = {}): void => {
  test(sql, { dialect: "bigquery", ...opts });
};
