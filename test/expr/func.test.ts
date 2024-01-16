import dedent from "dedent-js";
import { pretty, test, testBigquery, testPostgresql } from "../test_utils";

// Functions and function-like language constructs
describe("functions", () => {
  it(`formats function call to single line`, async () => {
    expect(await pretty(`SELECT sqrt(1, 2, 3)`, { printWidth: 16 }))
      .toBe(dedent`
      SELECT
        sqrt(1, 2, 3)
    `);
  });

  it(`formats function call to multiple lines`, async () => {
    expect(await pretty(`SELECT sqrt(1, 2, 3)`, { printWidth: 10 }))
      .toBe(dedent`
      SELECT
        sqrt(
          1,
          2,
          3
        )
    `);
  });

  it(`formats named function arguments`, async () => {
    await testBigquery(
      `SELECT concat_lower_or_upper(a => 'Hello', b => 'World', uppercase => TRUE)`,
    );
  });
  it(`formats long named function arguments`, async () => {
    await testBigquery(dedent`
      SELECT
        concat_lower_or_upper(
          first_parameter =>
            another_function_call(another_function_param => 'Hohoho Hello'),
          second_parameter => 'World',
          uppercase => TRUE
        )
    `);
  });
  // Behavior when sqlCanonicalSyntax: false
  it(`preserves old PostgreSQL := syntax for named arguments`, async () => {
    await testPostgresql(`SELECT my_func(foo := 'Hello', bar := 'World')`);
  });

  it(`formats count(*) func call`, async () => {
    await test(`SELECT count(*)`);
  });

  it(`formats count(DISTINCT) func call`, async () => {
    await test(`SELECT count(DISTINCT id)`);
  });

  describe("BigQuery function arguments", () => {
    it(`formats IGNORE NULLS and RESPECT NULLS`, async () => {
      await testBigquery(`SELECT my_func(foo IGNORE NULLS)`);
      await testBigquery(`SELECT my_func(foo RESPECT NULLS)`);
    });

    it(`formats ORDER BY`, async () => {
      await testBigquery(`SELECT my_func(foo ORDER BY id DESC)`);
    });

    it(`formats LIMIT`, async () => {
      await testBigquery(`SELECT my_func(foo LIMIT 10)`);
    });

    it(`formats combination of IGNORE NULLS, ORDER BY, LIMIT`, async () => {
      await testBigquery(
        `SELECT my_func(foo IGNORE NULLS ORDER BY id LIMIT 10)`,
      );
    });

    it(`formats long combo of DISTINCT, IGNORE NULLS, ORDER BY, LIMIT to multiple lines`, async () => {
      await testBigquery(dedent`
        SELECT
          my_function_name(
            DISTINCT
            first_argument,
            second_argument
            IGNORE NULLS
            ORDER BY some_field_name, other_field_name
            LIMIT 10000, 200
          )
      `);
    });
  });

  describe("cast", () => {
    it(`formats CAST expression`, async () => {
      await test(`SELECT CAST(127 AS INT)`);
    });

    it(`formats CAST() with FORMAT`, async () => {
      await testBigquery(`SELECT CAST('11-08' AS DATE FORMAT 'DD-MM')`);
      await testBigquery(
        `SELECT CAST('12:35' AS TIME FORMAT 'HH:MI' AT TIME ZONE 'UTC')`,
      );
    });
  });

  describe("raise", () => {
    it(`formats RAISE expression`, async () => {
      await test(`SELECT RAISE(IGNORE), RAISE(ABORT, 'Oh no!')`);
    });
  });

  describe("extract", () => {
    it(`formats EXTRACT() expression`, async () => {
      await testBigquery(`SELECT EXTRACT(MONTH FROM DATE '2002-08-16')`);
      await testBigquery(`SELECT EXTRACT(WEEK(SUNDAY) FROM date)`);
    });
  });

  describe("any_value", () => {
    it(`formats ANY_VALUE() with HAVING`, async () => {
      await testBigquery(`SELECT any_value(fruit)`);
      await testBigquery(`SELECT any_value(fruit HAVING MAX sold)`);
      await testBigquery(`SELECT any_value(fruit HAVING MIN sold)`);
    });
  });
});
