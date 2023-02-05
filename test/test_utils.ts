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
    parser: "sql-parser-cst-" + (opts.dialect ?? "sqlite"),
    plugins: [plugin],
    ...opts,
  });
};

export const pretty = (sql: string, opts: TestOptions = {}): string => {
  return rawPretty(sql, opts).trimEnd();
};

export const test = (sql: string, opts: TestOptions = {}): void => {
  expect(pretty(sql, opts)).toBe(sql);
};
