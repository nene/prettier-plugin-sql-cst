import dedent from "dedent-js";
import { pretty, test } from "./test_utils";

describe("comments", () => {
  it(`formats block comments`, () => {
    test(dedent`
      /* leading comment */
      SELECT
        1, /*com1*/
        2 /*com2*/
    `);
  });

  it(`formats line comments`, () => {
    test(dedent`
      -- first line comment
      -- second line comment
      SELECT 1 -- third line comment
    `);
  });

  it(`moves block comments before comma to line ends`, () => {
    expect(
      pretty(`
        SELECT
          1 /*com1*/,
          2
      `)
    ).toBe(dedent`
      SELECT
        1, /*com1*/
        2
    `);
  });
});
