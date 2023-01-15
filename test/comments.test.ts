import dedent from "dedent-js";
import { pretty } from "./test_utils";

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
