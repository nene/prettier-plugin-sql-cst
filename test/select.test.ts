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

  it(`formats FROM with short join to single line`, () => {
    expect(
      pretty(`SELECT * FROM client NATURAL JOIN client_sale`, {
        printWidth: 80,
      })
    ).toBe(dedent`
      SELECT * FROM client NATURAL JOIN client_sale
    `);
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

  it(`formats HAVING`, () => {
    expect(
      pretty(`SELECT * FROM tbl GROUP BY foo HAVING foo > bar`, {
        printWidth: 22,
      })
    ).toBe(dedent`
      SELECT *
      FROM tbl
      GROUP BY foo
      HAVING foo > bar
    `);
  });

  it(`formats HAVING to multiple lines`, () => {
    expect(
      pretty(`SELECT * FROM tbl GROUP BY foo HAVING foo > some_long_col_name`, {
        printWidth: 22,
      })
    ).toBe(dedent`
      SELECT *
      FROM tbl
      GROUP BY foo
      HAVING
        foo > some_long_col_name
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
});
