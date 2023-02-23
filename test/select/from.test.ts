import dedent from "dedent-js";
import { test } from "../test_utils";

describe("select FROM", () => {
  it(`formats join always to multiple lines`, () => {
    test(dedent`
      SELECT *
      FROM
        client
        NATURAL JOIN client_sale
    `);
  });

  it(`formats FROM with a long join to multiple lines`, () => {
    test(dedent`
      SELECT *
      FROM
        client_relation
        LEFT JOIN client_sale ON client_sale.client_id = client_relation.id
    `);
  });

  it(`formats FROM with multiple joins to multiple lines`, () => {
    test(dedent`
      SELECT *
      FROM
        client
        LEFT JOIN client_sale ON client_sale.client_id = client.id
        RIGHT OUTER JOIN client_attribute ON client_attribute.client_id = client.id
    `);
  });

  it(`formats FROM joins with USING-specification`, () => {
    test(dedent`
      SELECT *
      FROM
        client
        LEFT JOIN client_sale USING (client_id)
        RIGHT OUTER JOIN client_attribute USING (client_attrib_id, client_id)
    `);
  });

  it(`formats long join specifications to separate lines`, () => {
    test(dedent`
      SELECT *
      FROM
        client
        LEFT JOIN client_sale
          ON client_sale.client_id = client.id AND client_sale.type = 287
        RIGHT OUTER JOIN client_attribute
          USING (client_attribute_id, fabulously_long_col_name)
    `);
  });

  it(`formats table aliases`, () => {
    test(dedent`
      SELECT *
      FROM
        client AS c
        LEFT JOIN client_sale AS s ON s.client_id = c.id AND s.type = 287
    `);
  });

  it(`formats joins with subqueries`, () => {
    test(dedent`
      SELECT *
      FROM
        client
        LEFT JOIN (SELECT * FROM inventory WHERE price > 0) AS inventory
          ON inventory.client_id = client.id
    `);
  });

  it(`formats joins with table functions`, () => {
    test(dedent`
      SELECT *
      FROM
        client
        LEFT JOIN schm.gen_table(1, 2, 3) AS inventory
          ON inventory.client_id = client.id
    `);
  });

  it(`formats comma-operator cross-joins`, () => {
    test(dedent`
      SELECT *
      FROM
        client,
        inventory
    `);
  });

  it(`formats indexing modifiers`, () => {
    test(dedent`
      SELECT *
      FROM
        client INDEXED BY my_idx
        NATURAL LEFT JOIN inventory NOT INDEXED
    `);
  });

  describe("BigQuery", () => {
    it(`formats UNNEST()`, () => {
      test(
        dedent`
          SELECT *
          FROM UNNEST([10, 20, 30]) AS numbers WITH OFFSET
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats PIVOT()`, () => {
      test(
        dedent`
          SELECT *
          FROM
            Produce
            PIVOT(SUM(sales) FOR quarter IN ('Q1', 'Q2', 'Q3', 'Q4'))
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats long PIVOT() to multiple lines`, () => {
      test(
        dedent`
          SELECT *
          FROM
            Produce
            PIVOT(
              SUM(sales) AS total_sales, COUNT(*) AS num_records
              FOR quarter
              IN ('Q1', 'Q2')
            )
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats UNPIVOT()`, () => {
      test(
        dedent`
          SELECT *
          FROM
            Produce
            UNPIVOT(sales FOR quarter IN (Q1, Q2, Q3, Q4))
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats long UNPIVOT() with null-handling options to multiple lines`, () => {
      test(
        dedent`
          SELECT *
          FROM
            Produce
            UNPIVOT INCLUDE NULLS (
              (first_half_sales, second_half_sales)
              FOR semesters
              IN ((Q1, Q2) AS 'semester_1', (Q3, Q4) AS 'semester_2')
            )
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats TABLESPAMPLE operator`, () => {
      test(
        dedent`
          SELECT * FROM dataset.my_table TABLESAMPLE SYSTEM (10 PERCENT)
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats TABLESPAMPLE operator to multiple lines`, () => {
      test(
        dedent`
          SELECT *
          FROM
            myLongProjectName.myCustomDatasetName.my_table_name
            TABLESAMPLE SYSTEM (10 PERCENT)
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats FOR SYSTEM_TIME AS OF`, () => {
      test(
        dedent`
          SELECT *
          FROM tbl FOR SYSTEM_TIME AS OF '2017-01-01 10:00:00-07:00'
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats long FOR SYSTEM_TIME AS OF to multiple lines`, () => {
      test(
        dedent`
          SELECT *
          FROM
            my_favorite_table AS fancy_table_name
            FOR SYSTEM_TIME AS OF '2017-01-01 10:00:00-07:00'
        `,
        { dialect: "bigquery" }
      );
    });
  });
});
