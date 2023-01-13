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

describe("select", () => {
  it(`formats select in single line`, () => {
    expect(pretty(`SELECT 1, 2, 3`, { printWidth: 80 })).toBe(dedent`
      SELECT 1, 2, 3
    `);
  });

  it(`formats select on multiple lines`, () => {
    expect(pretty(`SELECT 1, 2, 3`, { printWidth: 10 })).toBe(dedent`
      SELECT
        1,
        2,
        3
    `);
  });

  it(`formats aliases`, () => {
    expect(pretty(`SELECT 1 AS a, 2 AS b, 3 c`, { printWidth: 20 }))
      .toBe(dedent`
      SELECT
        1 AS a,
        2 AS b,
        3 c
    `);
  });

  it(`formats binary expressions`, () => {
    expect(pretty(`SELECT 1 + 2 / 3 * (5 - 1)`, { printWidth: 20 }))
      .toBe(dedent`
      SELECT
        1 + 2 / 3 * (5 - 1)
    `);
  });

  it(`formats function call to single line`, () => {
    expect(pretty(`SELECT sqrt(1, 2, 3)`, { printWidth: 15 })).toBe(dedent`
      SELECT
        sqrt(1, 2, 3)
    `);
  });

  it(`formats function call to multiple lines`, () => {
    expect(pretty(`SELECT sqrt(1, 2, 3)`, { printWidth: 10 })).toBe(dedent`
      SELECT
        sqrt(
          1,
          2,
          3
        )
    `);
  });

  it(`formats statement ending with semicolon`, () => {
    expect(pretty(`SELECT 1;`)).toBe(dedent`
      SELECT 1;
    `);
  });

  it(`formats multiple statements`, () => {
    expect(pretty(`SELECT 1; SELECT 2; SELECT 3;`)).toBe(dedent`
      SELECT 1;
      SELECT 2;
      SELECT 3;
    `);
  });

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
