import dedent from "dedent-js";
import { test } from "./test_utils";

describe("select", () => {
  it(`formats short window clause on single lines`, () => {
    test(dedent`
      SELECT *
      FROM tbl
      WINDOW my_win AS (PARTITION BY col1)
    `);
  });

  it(`formats multiple window definitions on separate lines`, () => {
    test(dedent`
      SELECT *
      FROM tbl
      WINDOW
        win1 AS (PARTITION BY col1),
        win2 AS (win1)
    `);
  });

  it(`formats long window definitions on multiple lines`, () => {
    test(dedent`
      SELECT *
      FROM tbl
      WINDOW
        my_win1 AS (
          PARTITION BY col1, col2
          ORDER BY foo ASC
          RANGE CURRENT ROW
        ),
        my_win2 AS (
          my_win1
          ROWS BETWEEN 5 PRECEDING AND 3 FOLLOWING
          EXCLUDE CURRENT ROW
        ),
        my_win3 AS (
          ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
          EXCLUDE CURRENT ROW
        )
    `);
  });

  it("formats basic window function calls, referencing named window", () => {
    test(dedent`
      SELECT row_number() OVER win1
      FROM tbl
      WINDOW win1 AS (ORDER BY x)
    `);
  });

  it("formats short window function calls on single line", () => {
    test(dedent`
      SELECT row_number() OVER (ORDER BY x)
      FROM tbl
    `);
  });

  it("formats longer window function calls on multiple lines", () => {
    test(dedent`
      SELECT
        row_number() OVER (
          PARTITION BY y
          ORDER BY x
        )
      FROM tbl
    `);
  });

  it("formats window function call with short FILTER clause on single line", () => {
    test(dedent`
      SELECT row_number() FILTER (WHERE x > 10) OVER (ORDER BY x)
      FROM tbl
    `);
  });

  it("formats window function call with longer FILTER and OVER clauses on multiple lines", () => {
    test(dedent`
      SELECT
        group_concat(entity_name, '.')
          FILTER (WHERE entity_type IS NOT NULL)
          OVER (ORDER BY entity_name DESC)
      FROM tbl
    `);
  });
});
