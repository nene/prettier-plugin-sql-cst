import dedent from "dedent-js";
import { pretty } from "./test_utils";

describe("statement", () => {
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
});
