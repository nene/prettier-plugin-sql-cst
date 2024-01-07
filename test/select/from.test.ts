import dedent from "dedent-js";
import { test, testBigquery, testMysql, testPostgresql } from "../test_utils";

describe("select FROM", () => {
  it(`formats join always to multiple lines`, async () => {
    await test(dedent`
      SELECT *
      FROM
        client
        NATURAL JOIN client_sale
    `);
  });

  it(`formats FROM with a long join to multiple lines`, async () => {
    await test(dedent`
      SELECT *
      FROM
        client_relation
        LEFT JOIN client_sale ON client_sale.client_id = client_relation.id
    `);
  });

  it(`formats FROM with multiple joins to multiple lines`, async () => {
    await test(dedent`
      SELECT *
      FROM
        client
        LEFT JOIN client_sale ON client_sale.client_id = client.id
        RIGHT OUTER JOIN client_attribute ON client_attribute.client_id = client.id
    `);
  });

  it(`formats FROM joins with USING-specification`, async () => {
    await test(dedent`
      SELECT *
      FROM
        client
        LEFT JOIN client_sale USING (client_id)
        RIGHT OUTER JOIN client_attribute USING (client_attrib_id, client_id)
    `);
  });

  it(`formats long join specifications to separate lines`, async () => {
    await test(dedent`
      SELECT *
      FROM
        client
        LEFT JOIN client_sale
          ON client_sale.client_id = client.id AND client_sale.type = 287
        RIGHT OUTER JOIN client_attribute
          USING (client_attribute_id, fabulously_long_col_name)
    `);
  });

  it(`formats table aliases`, async () => {
    await test(dedent`
      SELECT *
      FROM
        client AS c
        LEFT JOIN client_sale AS s ON s.client_id = c.id AND s.type = 287
    `);
  });

  it(`formats joins with subqueries`, async () => {
    await test(dedent`
      SELECT *
      FROM
        client
        LEFT JOIN (SELECT * FROM inventory WHERE price > 0) AS inventory
          ON inventory.client_id = client.id
    `);
  });

  it(`formats joins with table functions`, async () => {
    await test(dedent`
      SELECT *
      FROM
        client
        LEFT JOIN schm.gen_table(1, 2, 3) AS inventory
          ON inventory.client_id = client.id
    `);
  });

  it(`formats comma-operator cross-joins`, async () => {
    await test(dedent`
      SELECT *
      FROM
        client,
        inventory
    `);
  });

  it(`formats indexing modifiers`, async () => {
    await test(dedent`
      SELECT *
      FROM
        client INDEXED BY my_idx
        NATURAL LEFT JOIN inventory NOT INDEXED
    `);
  });

  it(`formats FROM DUAL`, () => {
    testMysql(`SELECT * FROM DUAL`);
  });

  describe("LATERAL", () => {
    it(`formats LATERAL subquery`, () => {
      testMysql(dedent`
        SELECT *
        FROM
          tbl
          JOIN LATERAL (SELECT * FROM foo) AS t
      `);
    });

    it(`formats LATERAL table function`, () => {
      testPostgresql(dedent`
        SELECT *
        FROM LATERAL schm.foo(1, 2, 3) AS t
      `);
    });
  });

  describe("BigQuery", () => {
    it(`formats UNNEST()`, async () => {
      await testBigquery(dedent`
        SELECT *
        FROM UNNEST([10, 20, 30]) AS numbers WITH OFFSET
      `);
    });

    it(`formats PIVOT()`, async () => {
      await testBigquery(dedent`
        SELECT *
        FROM
          Produce
          PIVOT(SUM(sales) FOR quarter IN ('Q1', 'Q2', 'Q3', 'Q4'))
      `);
    });

    it(`formats long PIVOT() to multiple lines`, async () => {
      await testBigquery(dedent`
        SELECT *
        FROM
          Produce
          PIVOT(
            SUM(sales) AS total_sales, COUNT(*) AS num_records
            FOR quarter
            IN ('Q1', 'Q2')
          )
      `);
    });

    it(`formats UNPIVOT()`, async () => {
      await testBigquery(dedent`
        SELECT *
        FROM
          Produce
          UNPIVOT(sales FOR quarter IN (Q1, Q2, Q3, Q4))
      `);
    });

    it(`formats long UNPIVOT() with null-handling options to multiple lines`, async () => {
      await testBigquery(dedent`
        SELECT *
        FROM
          Produce
          UNPIVOT INCLUDE NULLS (
            (first_half_sales, second_half_sales)
            FOR semesters
            IN ((Q1, Q2) AS 'semester_1', (Q3, Q4) AS 'semester_2')
          )
      `);
    });

    describe("TABLESAMPLE", () => {
      it(`formats TABLESPAMPLE operator`, async () => {
        await testBigquery(dedent`
          SELECT * FROM dataset.my_table TABLESAMPLE SYSTEM (10 PERCENT)
        `);
      });

      it(`formats TABLESPAMPLE operator to multiple lines`, async () => {
        await testBigquery(dedent`
          SELECT *
          FROM
            myLongProjectName.myCustomDatasetName.my_table_name
            TABLESAMPLE SYSTEM (10 PERCENT)
        `);
      });

      it(`formats TABLESPAMPLE with custom sampling function and multiple parameters`, async () => {
        await testPostgresql(dedent`
          SELECT * FROM my_table TABLESAMPLE my_sampler (10, 20)
        `);
      });

      it(`formats TABLESPAMPLE with REPEATABLE clause`, async () => {
        await testPostgresql(dedent`
          SELECT * FROM my_table TABLESAMPLE BERNOULLI (5) REPEATABLE (123)
        `);
      });
    });

    it(`formats FOR SYSTEM_TIME AS OF`, async () => {
      await testBigquery(dedent`
        SELECT *
        FROM tbl FOR SYSTEM_TIME AS OF '2017-01-01 10:00:00-07:00'
      `);
    });

    it(`formats long FOR SYSTEM_TIME AS OF to multiple lines`, async () => {
      await testBigquery(dedent`
        SELECT *
        FROM
          my_favorite_table AS fancy_table_name
          FOR SYSTEM_TIME AS OF '2017-01-01 10:00:00-07:00'
      `);
    });
  });

  describe("MySQL", () => {
    it(`formats PARTITION selection`, async () => {
      await testMysql(`SELECT * FROM tbl1 PARTITION (p1, p2)`);
    });
  });

  describe("PostgreSQL", () => {
    it(`formats ONLY table`, async () => {
      await testPostgresql(`SELECT * FROM ONLY my_table`);
    });

    it(`formats table *`, async () => {
      await testPostgresql(`SELECT * FROM my_table *`);
    });

    it(`formats ROWS FROM`, async () => {
      await testPostgresql(`SELECT * FROM ROWS FROM (fn1(), fn2())`);
    });
  });
});
