import dedent from "dedent-js";
import { rawPretty, rawTest } from "./test_utils";

// In these tests we use rawPretty()
// to also test that formatted file always ends with final newline.
describe("statement", () => {
  it(`adds semicolon to statement without a semicolon`, () => {
    expect(rawPretty(`SELECT 1`)).toBe(dedent`
      SELECT 1;

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

  it(`ensures semicolon after last statement`, () => {
    expect(rawPretty(`SELECT 1; SELECT 2; SELECT 3`)).toBe(dedent`
      SELECT 1;
      SELECT 2;
      SELECT 3;

    `);
  });

  it(`preserves empty line between statements`, () => {
    rawTest(dedent`
      SELECT 1;

      SELECT 2;
      SELECT 3;

      SELECT 4;
      SELECT 5;

    `);
  });

  it(`replaces multiple empty lines with just one`, () => {
    expect(
      rawPretty(dedent`
        SELECT 1;



        SELECT 2;
      `)
    ).toBe(dedent`
      SELECT 1;

      SELECT 2;

    `);
  });
});
