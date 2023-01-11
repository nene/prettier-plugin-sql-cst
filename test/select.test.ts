import { format } from "prettier";
import dedent from "dedent-js";
import * as plugin from "../src/index";

const pretty = (sql: string) => {
  return format(sql, {
    parser: "sql-parser-cst",
    plugins: [plugin],
  });
};

describe("select", () => {
  it(`formats select`, () => {
    expect(pretty(`SELECT 1, 2, 3`)).toBe(dedent`
      SELECT
        1,
        2,
        3
    `);
  });
});
