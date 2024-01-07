import dedent from "dedent-js";
import { test, testPostgresql } from "../test_utils";

describe("select with", () => {
  it(`formats tiny WITH on same line as the rest of SELECT`, async () => {
    await test(dedent`
      WITH cte1 AS (SELECT * FROM client) SELECT * FROM cte1
    `);
  });

  it(`formats short WITH clause on single line inside multiline SELECT`, async () => {
    await test(dedent`
      WITH cte1 AS (SELECT * FROM client)
      SELECT *
      FROM cte1
    `);
  });

  it(`formats long WITH clause on multiple lines`, async () => {
    await test(dedent`
      WITH
        cte1 AS (SELECT * FROM client WHERE age > 100),
        cte2 AS (SELECT * FROM client WHERE age < 10)
      SELECT *
      FROM cte1
    `);
  });

  it(`formats WITH clause with various options`, async () => {
    await test(dedent`
      WITH RECURSIVE
        cte1 AS MATERIALIZED (SELECT * FROM client WHERE age > 100),
        cte2 AS NOT MATERIALIZED (SELECT * FROM client WHERE age < 10)
      SELECT *
      FROM cte1
    `);
  });

  it(`formats SELECT inside CTE on multiple lines`, async () => {
    await test(dedent`
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

  it(`formats CTE with column names list`, async () => {
    await test(dedent`
      WITH oldies(id, name) AS (SELECT * FROM client WHERE age > 100)
      SELECT *
      FROM oldies
    `);
  });

  describe("PostgreSQL", () => {
    it(`formats CYCLE and SEARCH clauses in WITH`, async () => {
      await testPostgresql(dedent`
        WITH RECURSIVE
          cte1 AS (SELECT * FROM my_table WHERE x > 0)
            CYCLE a, b SET a TO 1 DEFAULT 0 USING pathcol,
          cte2 AS (
            SELECT *
            FROM client
            WHERE age > 100
          ) SEARCH BREADTH FIRST BY a, b SET target_col
        SELECT *
        FROM
          cte1,
          cte2
      `);
    });
  });
});
