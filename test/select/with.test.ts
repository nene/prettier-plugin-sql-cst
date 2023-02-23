import dedent from "dedent-js";
import { test } from "../test_utils";

describe("select with", () => {
  it(`formats tiny WITH on same line as the rest of SELECT`, () => {
    test(dedent`
      WITH cte1 AS (SELECT * FROM client) SELECT * FROM cte1
    `);
  });

  it(`formats short WITH clause on single line inside multiline SELECT`, () => {
    test(dedent`
      WITH cte1 AS (SELECT * FROM client)
      SELECT *
      FROM cte1
    `);
  });

  it(`formats long WITH clause on multiple lines`, () => {
    test(dedent`
      WITH
        cte1 AS (SELECT * FROM client WHERE age > 100),
        cte2 AS (SELECT * FROM client WHERE age < 10)
      SELECT *
      FROM cte1
    `);
  });

  it(`formats WITH clause with various options`, () => {
    test(dedent`
      WITH RECURSIVE
        cte1 AS MATERIALIZED (SELECT * FROM client WHERE age > 100),
        cte2 AS NOT MATERIALIZED (SELECT * FROM client WHERE age < 10)
      SELECT *
      FROM cte1
    `);
  });

  it(`formats SELECT inside CTE on multiple lines`, () => {
    test(dedent`
      WITH RECURSIVE
        cte1 AS (
          SELECT *
          FROM client
          WHERE age > 100
        )
      SELECT *
      FROM cte1
    `);
  });

  it(`formats CTE with column names list`, () => {
    test(dedent`
      WITH oldies(id, name) AS (SELECT * FROM client WHERE age > 100)
      SELECT *
      FROM oldies
    `);
  });
});
