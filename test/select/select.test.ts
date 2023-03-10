import dedent from "dedent-js";
import { pretty, test, testBigquery } from "../test_utils";

describe("select", () => {
  it(`formats short SELECT..FROM..WHERE on single line`, () => {
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

  it(`preserves multiline SELECT columns (even if they would fit on a single line)`, () => {
    test(dedent`
      SELECT
        col1,
        col2,
        col3
    `);
  });

  it(`formats SELECT *`, () => {
    test(`SELECT *`);
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

  it(`formats LIMIT with just count`, () => {
    test(`SELECT * FROM tbl LIMIT 10`);
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
    it(`removes trailing commas from SELECT`, () => {
      expect(pretty(`SELECT 1, 2, 3,`, { dialect: "bigquery" })).toBe(
        `SELECT 1, 2, 3`
      );
    });

    it(`removes trailing commas from multiline SELECT`, () => {
      expect(
        pretty(
          dedent`
            SELECT
              'something long',
              'something even longer',
              'another thing that is extra long',
              'and then something even more grandiose', -- comment
            FROM my_table
          `,
          { dialect: "bigquery" }
        )
      ).toBe(
        dedent`
          SELECT
            'something long',
            'something even longer',
            'another thing that is extra long',
            'and then something even more grandiose' -- comment
          FROM my_table
        `
      );
    });

    it(`formats SELECT * EXCEPT`, () => {
      testBigquery(`SELECT * EXCEPT (order_id) FROM orders`);
    });

    it(`formats SELECT * REPLACE`, () => {
      testBigquery(`SELECT * REPLACE (order_id AS id) FROM orders`);
    });

    it(`formats SELECT AS STRUCT`, () => {
      testBigquery(`SELECT AS STRUCT 1 AS a, 2 AS b`);
    });

    it(`formats SELECT AS VALUE`, () => {
      testBigquery(`SELECT AS VALUE foo()`);
    });

    it(`formats GROUP BY ROLLUP()`, () => {
      testBigquery(`SELECT * FROM tbl GROUP BY ROLLUP(a, b, c)`);
    });

    it(`formats GROUP BY ROLLUP() to multiple lines`, () => {
      testBigquery(dedent`
        SELECT *
        FROM my_table_name
        GROUP BY
          ROLLUP(
            my_table_name.column1,
            my_table_name.column2,
            my_table_name.column3,
            my_table_name.column4
          )
      `);
    });

    it(`formats QUALIFY clause`, () => {
      testBigquery(`SELECT * FROM tbl QUALIFY x > 10`);
    });

    it(`formats long QUALIFY clause to multiple lines`, () => {
      testBigquery(dedent`
        SELECT *
        FROM my_table_name
        QUALIFY
          my_table_name.some_long_column_name > my_table_name.some_long_column_name2
      `);
    });
  });
});
