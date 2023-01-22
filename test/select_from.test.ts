import dedent from "dedent-js";
import { pretty, test } from "./test_utils";

describe("select FROM", () => {
  it(`formats select with short join to single line`, () => {
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
});
