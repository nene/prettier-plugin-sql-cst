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

export const rawPretty = async (
  sql: string,
  opts: TestOptions = {},
): Promise<string> => {
  return format(sql, {
    parser: opts.dialect ?? "sqlite",
    plugins: [plugin],
    ...opts,
  });
};

export const pretty = async (
  sql: string,
  opts: TestOptions = {},
): Promise<string> => {
  const formatted = await rawPretty(sql, opts);
  if (!/;\n$/.test(formatted)) {
    throw new Error(
      `Expected semicolon and newline at the end of:\n${formatted}`,
    );
  }
  return formatted.replace(/;\n$/, "");
};

export const rawTest = async (
  sql: string,
  opts: TestOptions = {},
): Promise<void> => {
  expect(await rawPretty(sql, opts)).toBe(sql);
};

export const test = async (
  sql: string,
  opts: TestOptions = {},
): Promise<void> => {
  expect(await pretty(sql, opts)).toBe(sql);
};

export const testBigquery = async (
  sql: string,
  opts: TestOptions = {},
): Promise<void> => {
  await test(sql, { dialect: "bigquery", ...opts });
};

export const testMysql = async (
  sql: string,
  opts: TestOptions = {},
): Promise<void> => {
  await test(sql, { dialect: "mysql", ...opts });
};

export const testMariadb = async (
  sql: string,
  opts: TestOptions = {},
): Promise<void> => {
  await test(sql, { dialect: "mariadb", ...opts });
};

export const testPostgresql = async (
  sql: string,
  opts: TestOptions = {},
): Promise<void> => {
  await test(sql, { dialect: "postgresql", ...opts });
};
