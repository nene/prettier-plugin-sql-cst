import dedent from "dedent-js";
import { rawPretty, rawTest } from "./test_utils";

// In these tests we use rawPretty()
// to also test that formatted file always ends with final newline.
describe("statement", () => {
  it(`adds semicolon to statement without a semicolon`, async () => {
    expect(await rawPretty(`SELECT 1`)).toBe(dedent`
      SELECT 1;

    `);
  });

  it(`formats statement ending with semicolon`, async () => {
    expect(await rawPretty(`SELECT 1;`)).toBe(dedent`
      SELECT 1;

    `);
  });

  it(`formats multiple statements`, async () => {
    expect(await rawPretty(`SELECT 1; SELECT 2; SELECT 3;`)).toBe(dedent`
      SELECT 1;
      SELECT 2;
      SELECT 3;

    `);
  });

  it(`ensures semicolon after last statement`, async () => {
    expect(await rawPretty(`SELECT 1; SELECT 2; SELECT 3`)).toBe(dedent`
      SELECT 1;
      SELECT 2;
      SELECT 3;

    `);
  });

  it(`preserves empty line between statements`, async () => {
    rawTest(dedent`
      SELECT 1;

      SELECT 2;
      SELECT 3;

      SELECT 4;
      SELECT 5;

    `);
  });

  it(`replaces multiple empty lines with just one`, async () => {
    expect(
      await rawPretty(dedent`
        SELECT 1;



        SELECT 2;
      `)
    ).toBe(dedent`
      SELECT 1;

      SELECT 2;

    `);
  });
});
