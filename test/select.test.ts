import { format } from "prettier";
import { resolve } from "path";
import dedent from "dedent-js";

const pluginPath = resolve(__dirname, "../dist/index.js");

const pretty = (sql: string) => {
  return format(sql, {
    parser: "sql-parse",
    plugins: [pluginPath],
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
