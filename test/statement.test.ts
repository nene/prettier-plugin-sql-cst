import dedent from "dedent-js";
import { rawPretty } from "./test_utils";

// In these tests we use rawPretty()
// to also test that formatted file always ends with final newline.
describe("statement", () => {
  it(`formats statement ending without a semicolon`, () => {
    expect(rawPretty(`SELECT 1`)).toBe(dedent`
      SELECT 1

    `);
  });

  it(`formats statement ending with semicolon`, () => {
    expect(rawPretty(`SELECT 1;`)).toBe(dedent`
      SELECT 1;

    `);
  });

  it(`formats multiple statements`, () => {
    expect(rawPretty(`SELECT 1; SELECT 2; SELECT 3;`)).toBe(dedent`
      SELECT 1;

      SELECT 2;

      SELECT 3;

    `);
  });
});
