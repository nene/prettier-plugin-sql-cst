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
});
