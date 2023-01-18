import dedent from "dedent-js";
import { pretty, test } from "./test_utils";

describe("expr", () => {
  it(`formats binary expressions`, () => {
    expect(
      pretty(`SELECT 1 + 2 / 3 * (5 - 1), true OR false AND true`, {
        printWidth: 20,
      })
    ).toBe(dedent`
      SELECT
        1 + 2 / 3 * (5 - 1),
        true OR false AND true
    `);
  });

  it(`formats IN and NOT IN expressions`, () => {
    test(`SELECT col1 IN (1, 2, 3), col2 NOT IN (4, 5, 6)`);
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