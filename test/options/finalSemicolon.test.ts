import dedent from "dedent-js";
import { rawPretty } from "../test_utils";

// In these tests we use rawPretty()
// to also test that formatted file always ends with final newline.
describe("sqlFinalSemicolon option", () => {
  describe("with sqlFinalSemicolon enabled (the default)", () => {
    it(`adds semicolon to statement without a semicolon`, async () => {
      expect(await rawPretty(`SELECT 1`)).toBe(dedent`
        SELECT 1;

      `);
    });

    it(`ensures semicolon after last statement`, async () => {
      expect(await rawPretty(`SELECT 1; SELECT 2; SELECT 3`)).toBe(dedent`
        SELECT 1;
        SELECT 2;
        SELECT 3;

      `);
    });
  });

  describe("with sqlFinalSemicolon disabled", () => {
    it(`does not add semicolon to statement without a semicolon`, async () => {
      expect(await rawPretty(`SELECT 1`, { sqlFinalSemicolon: false })).toBe(
        dedent`
          SELECT 1

        `,
      );
    });

    it(`adds no semicolon after last statement`, async () => {
      expect(
        await rawPretty(`SELECT 1; SELECT 2; SELECT 3`, {
          sqlFinalSemicolon: false,
        }),
      ).toBe(dedent`
        SELECT 1;
        SELECT 2;
        SELECT 3

      `);
    });

    it(`does not remove an existing trailing semicolon`, async () => {
      expect(await rawPretty(`SELECT 1;`, { sqlFinalSemicolon: false })).toBe(
        dedent`
          SELECT 1;

        `,
      );
    });
  });
});
