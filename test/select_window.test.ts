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
});
