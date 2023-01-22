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
        ORDER BY foo ASC, long_name DESC
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
        long_name DESC
      LIMIT
        250 OFFSET 100000000
    `);
  });

  it(`formats LIMIT with just count`, () => {
    test(`SELECT * FROM tbl LIMIT 10`);
  });

  it(`formats FROM with short join to single line`, () => {
    test(`SELECT * FROM client NATURAL JOIN client_sale`);
  });

  it(`formats FROM with a join to multiple lines`, () => {
    expect(
      pretty(
        `SELECT * FROM client LEFT JOIN client_sale ON client_sale.client_id = client.id`,
        { printWidth: 60 }
      )
    ).toBe(dedent`
      SELECT *
      FROM
        client
        LEFT JOIN client_sale ON client_sale.client_id = client.id
    `);
  });

  it(`formats FROM with multiple joins to multiple lines`, () => {
    expect(
      pretty(
        `SELECT * FROM client
        LEFT JOIN client_sale ON client_sale.client_id = client.id
        RIGHT OUTER JOIN client_attribute ON client_attribute.client_id = client.id`,
        { printWidth: 80 }
      )
    ).toBe(dedent`
      SELECT *
      FROM
        client
        LEFT JOIN client_sale ON client_sale.client_id = client.id
        RIGHT OUTER JOIN client_attribute ON client_attribute.client_id = client.id
    `);
  });

  it(`formats FROM joins with USING-specification`, () => {
    expect(
      pretty(
        `SELECT * FROM client
        LEFT JOIN client_sale USING (client_id)
        RIGHT OUTER JOIN client_attribute USING (client_attrib_id, client_id)`,
        { printWidth: 80 }
      )
    ).toBe(dedent`
      SELECT *
      FROM
        client
        LEFT JOIN client_sale USING (client_id)
        RIGHT OUTER JOIN client_attribute USING (client_attrib_id, client_id)
    `);
  });

  it(`formats long join specifications to separate lines`, () => {
    expect(
      pretty(
        `SELECT * FROM client
        LEFT JOIN client_sale ON client_sale.client_id = client.id AND client_sale.type = 287
        RIGHT OUTER JOIN client_attribute USING (client_attribute_id, fabulously_long_col_name)`,
        { printWidth: 80 }
      )
    ).toBe(dedent`
      SELECT *
      FROM
        client
        LEFT JOIN client_sale
          ON client_sale.client_id = client.id AND client_sale.type = 287
        RIGHT OUTER JOIN client_attribute
          USING (client_attribute_id, fabulously_long_col_name)
    `);
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
});
