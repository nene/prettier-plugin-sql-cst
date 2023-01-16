import dedent from "dedent-js";
import { pretty } from "./test_utils";

describe("select", () => {
  it(`formats SELECT *`, () => {
    expect(pretty(`SELECT *`)).toBe(dedent`
      SELECT *
    `);
  });

  it(`formats select in single line`, () => {
    expect(pretty(`SELECT 1, 2, 3`, { printWidth: 80 })).toBe(dedent`
      SELECT 1, 2, 3
    `);
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
    expect(pretty(`SELECT a, b, c FROM tbl WHERE x > y`)).toBe(dedent`
      SELECT a, b, c FROM tbl WHERE x > y
    `);
  });

  it(`formats SELECT..FROM..WHERE on multiple lines`, () => {
    expect(pretty(`SELECT a, b, c FROM tbl WHERE x > y`, { printWidth: 15 }))
      .toBe(dedent`
      SELECT a, b, c
      FROM tbl
      WHERE x > y
    `);
  });

  it(`formats FROM & WHERE on multiple lines`, () => {
    expect(
      pretty(
        `SELECT * FROM my_table_name WHERE my_table_name.x > my_table_name.y`,
        { printWidth: 15 }
      )
    ).toBe(dedent`
      SELECT *
      FROM
        my_table_name
      WHERE
        my_table_name.x > my_table_name.y
    `);
  });

  it(`formats ORDER BY`, () => {
    expect(
      pretty(`SELECT * FROM tbl ORDER BY foo, bar DESC`, { printWidth: 22 })
    ).toBe(dedent`
      SELECT *
      FROM tbl
      ORDER BY foo, bar DESC
    `);
  });

  it(`formats ORDER BY to multiple lines`, () => {
    expect(
      pretty(`SELECT * FROM tbl ORDER BY foo ASC, bar DESC`, { printWidth: 22 })
    ).toBe(dedent`
      SELECT *
      FROM tbl
      ORDER BY
        foo ASC,
        bar DESC
    `);
  });

  it(`formats GROUP BY`, () => {
    expect(pretty(`SELECT * FROM tbl GROUP BY foo, bar`, { printWidth: 22 }))
      .toBe(dedent`
      SELECT *
      FROM tbl
      GROUP BY foo, bar
    `);
  });

  it(`formats GROUP BY to multiple lines`, () => {
    expect(
      pretty(`SELECT * FROM tbl GROUP BY long_col, even_longer_col`, {
        printWidth: 22,
      })
    ).toBe(dedent`
      SELECT *
      FROM tbl
      GROUP BY
        long_col,
        even_longer_col
    `);
  });

  it(`formats aliases`, () => {
    expect(pretty(`SELECT 1 AS a, 2 AS b, 3 c`, { printWidth: 20 }))
      .toBe(dedent`
      SELECT
        1 AS a,
        2 AS b,
        3 c
    `);
  });

  it(`formats binary expressions`, () => {
    expect(
      pretty(`SELECT 1 + 2 / 3 * (5 - 1), true OR false AND true`, {
        printWidth: 20,
      })
    ).toBe(dedent`
      SELECT
        1 + 2 / 3 * (5 - 1),
        true OR false AND true
    `);
  });

  it(`formats function call to single line`, () => {
    expect(pretty(`SELECT sqrt(1, 2, 3)`, { printWidth: 15 })).toBe(dedent`
      SELECT
        sqrt(1, 2, 3)
    `);
  });

  it(`formats function call to multiple lines`, () => {
    expect(pretty(`SELECT sqrt(1, 2, 3)`, { printWidth: 10 })).toBe(dedent`
      SELECT
        sqrt(
          1,
          2,
          3
        )
    `);
  });

  it(`formats statement ending with semicolon`, () => {
    expect(pretty(`SELECT 1;`)).toBe(dedent`
      SELECT 1;
    `);
  });

  it(`formats multiple statements`, () => {
    expect(pretty(`SELECT 1; SELECT 2; SELECT 3;`)).toBe(dedent`
      SELECT 1;
      SELECT 2;
      SELECT 3;
    `);
  });
});
