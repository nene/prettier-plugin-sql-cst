import dedent from "dedent-js";
import { pretty, test } from "./test_utils";

describe("select", () => {
  it(`formats SELECT *`, () => {
    test(`SELECT *`);
  });

  it(`formats select in single line`, () => {
    test(`SELECT 1, 2, 3`);
  });

  it(`formats select on multiple lines`, () => {
    expect(pretty(`SELECT 1, 2, 3`, { printWidth: 10 })).toBe(dedent`
      SELECT
        1,
        2,
        3
    `);
  });

  it(`formats SELECT..FROM..WHERE on single line`, () => {
    test(`SELECT a, b, c FROM tbl WHERE x > y`);
  });

  it(`forces multi-line format when the original select is already multi-line`, () => {
    expect(pretty(`SELECT a, b, c \n FROM tbl WHERE x > y`)).toBe(dedent`
      SELECT a, b, c
      FROM tbl
      WHERE x > y
    `);
  });

  it(`formats each SELECT clause to separate line`, () => {
    test(dedent`
      SELECT *
      FROM tbl
      WHERE x > y
      GROUP BY foo, bar
      HAVING foo > bar
      ORDER BY foo, bar DESC
      LIMIT 100, 25
    `);
  });

  it(`formats each SELECT clause with indented body when it doesn't fit on a single line`, () => {
    expect(
      pretty(
        `SELECT very_long_col_name, another_long_col_name
        FROM my_super_long_table_name
        WHERE my_table_name.x > my_table_name.y
        GROUP BY long_col, even_longer_col
        HAVING foo > some_long_col_name
        ORDER BY foo ASC, bar DESC NULLS FIRST
        LIMIT 250 OFFSET 100000000
        `,
        { printWidth: 25 }
      )
    ).toBe(dedent`
      SELECT
        very_long_col_name,
        another_long_col_name
      FROM
        my_super_long_table_name
      WHERE
        my_table_name.x > my_table_name.y
      GROUP BY
        long_col,
        even_longer_col
      HAVING
        foo > some_long_col_name
      ORDER BY
        foo ASC,
        bar DESC NULLS FIRST
      LIMIT
        250 OFFSET 100000000
    `);
  });

  it(`formats LIMIT with just count`, () => {
    test(`SELECT * FROM tbl LIMIT 10`);
  });

  it(`formats aliases`, () => {
    test(
      dedent`
        SELECT
          1 AS a,
          2 AS b,
          3 c
      `,
      { printWidth: 20 }
    );
  });

  it(`formats SELECT DISTINCT`, () => {
    test(
      dedent`
        SELECT DISTINCT
          col1,
          col2,
          col3
        FROM tbl
      `,
      { printWidth: 20 }
    );
  });

  it(`formats set operations of select statements`, () => {
    test(dedent`
      SELECT * FROM client WHERE status = 'inactive'
      UNION ALL
      SELECT * FROM disabled_client
      INTERSECT
      SELECT * FROM faulty_client
    `);
  });

  describe("BigQuery", () => {
    it(`formats SELECT * EXCEPT`, () => {
      test(`SELECT * EXCEPT (order_id) FROM orders`, { dialect: "bigquery" });
    });

    it(`formats SELECT * REPLACE`, () => {
      test(`SELECT * REPLACE (order_id AS id) FROM orders`, {
        dialect: "bigquery",
      });
    });
  });
});
