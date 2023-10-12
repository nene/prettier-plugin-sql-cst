import dedent from "dedent-js";
import { pretty, test, testBigquery } from "../test_utils";

// Functions and function-like language constructs
describe("functions", () => {
  it(`formats function call to single line`, async () => {
    expect(pretty(`SELECT sqrt(1, 2, 3)`, { printWidth: 16 })).toBe(dedent`
      SELECT
        sqrt(1, 2, 3)
    `);
  });

  it(`formats function call to multiple lines`, async () => {
    expect(pretty(`SELECT sqrt(1, 2, 3)`, { printWidth: 10 })).toBe(dedent`
      SELECT
        sqrt(
          1,
          2,
          3
        )
    `);
  });

  it(`formats count(*) func call`, async () => {
    test(`SELECT count(*)`);
  });

  it(`formats count(DISTINCT) func call`, async () => {
    test(`SELECT count(DISTINCT id)`);
  });

  describe("cast", () => {
    it(`formats CAST expression`, async () => {
      test(`SELECT CAST(127 AS INT)`);
    });

    it(`formats CAST() with FORMAT`, async () => {
      testBigquery(`SELECT CAST('11-08' AS DATE FORMAT 'DD-MM')`);
      testBigquery(
        `SELECT CAST('12:35' AS TIME FORMAT 'HH:MI' AT TIME ZONE 'UTC')`
      );
    });
  });

  describe("raise", () => {
    it(`formats RAISE expression`, async () => {
      test(`SELECT RAISE(IGNORE), RAISE(ABORT, 'Oh no!')`);
    });
  });

  describe("extract", () => {
    it(`formats EXTRACT() expression`, async () => {
      testBigquery(`SELECT EXTRACT(MONTH FROM DATE '2002-08-16')`);
      testBigquery(`SELECT EXTRACT(WEEK(SUNDAY) FROM date)`);
    });
  });

  describe("any_value", () => {
    it(`formats ANY_VALUE() with HAVING`, async () => {
      testBigquery(`SELECT any_value(fruit)`);
      testBigquery(`SELECT any_value(fruit HAVING MAX sold)`);
      testBigquery(`SELECT any_value(fruit HAVING MIN sold)`);
    });
  });
});
