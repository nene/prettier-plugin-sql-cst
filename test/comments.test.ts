import { format } from "prettier";
import dedent from "dedent-js";
import * as plugin from "../src/index";

interface PrettyOptions {
  printWidth?: number;
}

const pretty = (sql: string, opts: PrettyOptions = {}) => {
  return format(sql, {
    parser: "sql-parser-cst",
    plugins: [plugin],
    ...opts,
  });
};

describe("comments", () => {
  it(`formats block comments`, () => {
    expect(
      pretty(
        `/*leading comment*/
        SELECT 1`
      )
    ).toBe(dedent`
      /*leading comment*/
      SELECT 1
    `);
  });

  it(`formats line comments`, () => {
    expect(pretty(`SELECT 1 -- line comment`)).toBe(dedent`
      SELECT 1 -- line comment
    `);
  });
});
