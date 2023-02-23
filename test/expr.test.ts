import dedent from "dedent-js";
import { pretty, test } from "./test_utils";

describe("expr", () => {
  it(`formats binary expressions`, () => {
    expect(
      pretty(`SELECT 1 + 2 / 3 * (5 - 1), TRUE OR FALSE AND TRUE`, {
        printWidth: 25,
      })
    ).toBe(dedent`
      SELECT
        1 + 2 / 3 * (5 - 1),
        TRUE OR FALSE AND TRUE
    `);
  });

  it(`formats IN expressions`, () => {
    test(`SELECT col1 IN (1, 2, 3), col2 NOT IN (4, 5, 6)`);
  });

  it(`formats LIKE expressions`, () => {
    test(`SELECT fname LIKE 'Mar%', lname NOT LIKE '%ony'`);
  });

  it(`formats IS expressions`, () => {
    test(dedent`
      SELECT
        x IS NOT NULL,
        y IS NULL,
        z IS DISTINCT FROM NULL,
        q IS NOT DISTINCT FROM NULL
    `);
  });

  it(`formats BETWEEN expressions`, () => {
    test(
      dedent`
        SELECT
          x BETWEEN 1 AND 10,
          y NOT BETWEEN 2 AND 8
      `,
      { printWidth: 40 }
    );
  });

  it(`formats EXISTS expressions`, () => {
    test(
      dedent`
        SELECT
          EXISTS (SELECT * FROM tbl),
          NOT EXISTS (SELECT col FROM tbl2)
      `,
      { printWidth: 60 }
    );
  });

  it(`formats ISNULL / NOTNULL / NOT NULL expressions`, () => {
    test(`SELECT fname ISNULL, xname NOTNULL, lname NOT NULL`);
  });

  it(`formats NOT expressions`, () => {
    test(`SELECT NOT x > 10`);
  });

  it(`formats negation`, () => {
    test(`SELECT -x`);
  });

  it(`formats a chain of AND/OR operators to multiple lines`, () => {
    test(dedent`
      SELECT *
      FROM client
      WHERE
        client.country = 'Nicaragua'
        AND client.expired IS NULL
        AND client.yearly_income > 20000
        AND client.monthly_income > 100
        OR client.special = TRUE
    `);
  });

  it(`eliminates unnecessary (((nested))) parenthesis`, () => {
    expect(pretty(`SELECT (((1 + 2))) * 3`)).toBe(dedent`
      SELECT (1 + 2) * 3
    `);
  });

  describe("case", () => {
    it(`formats CASE expression always on multiple lines`, () => {
      test(dedent`
        SELECT
          CASE x
            WHEN 1 THEN 'A'
            ELSE 'B'
          END
      `);
    });

    it(`formats CASE expression with base expression`, () => {
      test(dedent`
        SELECT
          CASE status
            WHEN 1 THEN 'good'
            WHEN 2 THEN 'bad'
            ELSE 'unknown'
          END
      `);
    });

    it(`formats CASE expression without base expression`, () => {
      test(dedent`
        SELECT
          CASE
            WHEN status = 1 THEN 'good'
            WHEN status = 2 THEN 'bad'
            ELSE 'unknown'
          END
      `);
    });
  });

  describe("function-like", () => {
    it(`formats function call to single line`, () => {
      expect(pretty(`SELECT sqrt(1, 2, 3)`, { printWidth: 16 })).toBe(dedent`
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

    it(`formats count(*) func call`, () => {
      test(`SELECT count(*)`);
    });

    it(`formats count(DISTINCT) func call`, () => {
      test(`SELECT count(DISTINCT id)`);
    });

    it(`formats CAST expression`, () => {
      test(`SELECT CAST(127 AS INT)`);
    });

    it(`formats CAST() with FORMAT`, () => {
      test(`SELECT CAST('11-08' AS DATE FORMAT 'DD-MM')`, {
        dialect: "bigquery",
      });
      test(`SELECT CAST('12:35' AS TIME FORMAT 'HH:MI' AT TIME ZONE 'UTC')`, {
        dialect: "bigquery",
      });
    });

    it(`formats RAISE expression`, () => {
      test(`SELECT RAISE(IGNORE), RAISE(ABORT, 'Oh no!')`);
    });
  });

  describe("BigQuery", () => {
    it(`formats BigQuery quoted table names`, () => {
      test("SELECT * FROM `my-project.mydataset.mytable`", {
        dialect: "bigquery",
      });
    });

    it(`formats BigQuery array field access`, () => {
      test(
        dedent`
          SELECT
            item_array,
            item_array[OFFSET(1)] AS item_offset,
            item_array[ORDINAL(1)] AS item_ordinal,
            item_array[SAFE_OFFSET(6)] AS item_safe_offset
          FROM (SELECT ["coffee", "tea", "milk"] AS item_array)
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats BigQuery array field access to multiple lines`, () => {
      test(
        dedent`
          SELECT
            ["Coffee Cup", "Tea Kettle", "Milk Glass"][
              SAFE_OFFSET(some_really_long_index_number)
            ]
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats BigQuery JSON field access`, () => {
      test(
        dedent`
          SELECT json_value.class.students[0]['name']
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats BigQuery @@system_variables`, () => {
      test(`SELECT @@error.message`, { dialect: "bigquery" });
    });
  });
});
