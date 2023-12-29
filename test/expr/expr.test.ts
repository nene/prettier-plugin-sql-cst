import dedent from "dedent-js";
import {
  pretty,
  test,
  testBigquery,
  testMysql,
  testPostgresql,
} from "../test_utils";

describe("expr", () => {
  it(`formats binary expressions`, async () => {
    expect(
      await pretty(`SELECT 1 + 2 / 3 * (5 - 1), TRUE OR FALSE AND TRUE`, {
        printWidth: 25,
      }),
    ).toBe(dedent`
      SELECT
        1 + 2 / 3 * (5 - 1),
        TRUE OR FALSE AND TRUE
    `);
  });

  it(`formats IN expressions`, async () => {
    await test(`SELECT col1 IN (1, 2, 3), col2 NOT IN (4, 5, 6)`);
  });

  it(`formats LIKE expressions`, async () => {
    await test(`SELECT fname LIKE 'Mar%', lname NOT LIKE '%ony'`);
  });

  it(`formats IS expressions`, async () => {
    await test(dedent`
      SELECT
        x IS NOT NULL,
        y IS NULL,
        z IS DISTINCT FROM NULL,
        q IS NOT DISTINCT FROM NULL
    `);
  });

  it(`formats BETWEEN expressions`, async () => {
    await test(
      dedent`
        SELECT
          x BETWEEN 1 AND 10,
          y NOT BETWEEN 2 AND 8
      `,
      { printWidth: 40 },
    );
  });

  it(`formats EXISTS expressions`, async () => {
    await test(
      dedent`
        SELECT
          EXISTS (SELECT * FROM tbl),
          NOT EXISTS (SELECT col FROM tbl2)
      `,
      { printWidth: 60 },
    );
  });

  it(`formats ISNULL / NOTNULL / NOT NULL expressions`, async () => {
    await test(`SELECT fname ISNULL, xname NOTNULL, lname NOT NULL`);
  });

  it(`formats NOT expressions`, async () => {
    await test(`SELECT NOT x > 10`);
  });

  it(`formats negation`, async () => {
    await test(`SELECT -x`);
  });

  it(`formats a chain of AND/OR operators to multiple lines`, async () => {
    await test(dedent`
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

  it(`eliminates unnecessary (((nested))) parenthesis`, async () => {
    expect(await pretty(`SELECT (((1 + 2))) * 3`)).toBe(dedent`
      SELECT (1 + 2) * 3
    `);
  });

  it(`preserves comments when eliminating (((nested))) parenthesis`, async () => {
    expect(await pretty(`SELECT (/*c1*/(/*c2*/(/*c3*/ 1 + 2))) * 3`))
      .toBe(dedent`
      SELECT /*c1*/ /*c2*/ (/*c3*/ 1 + 2) * 3
    `);
  });

  it(`eliminates unnecessary parenthesis around function arguments`, async () => {
    expect(await pretty(`SELECT my_func((id), (name))`)).toBe(dedent`
      SELECT my_func(id, name)
    `);
  });

  it(`preserves comments when eliminating func(((arg))) parenthesis`, async () => {
    expect(await pretty(`SELECT count(/*c1*/(/*c2*/ id))`)).toBe(dedent`
      SELECT count(/*c1*/ /*c2*/ id)
    `);
  });

  describe("case", () => {
    it(`formats CASE expression always on multiple lines`, async () => {
      await test(dedent`
        SELECT
          CASE x
            WHEN 1 THEN 'A'
            ELSE 'B'
          END
      `);
    });

    it(`formats CASE expression with base expression`, async () => {
      await test(dedent`
        SELECT
          CASE status
            WHEN 1 THEN 'good'
            WHEN 2 THEN 'bad'
            ELSE 'unknown'
          END
      `);
    });

    it(`formats CASE expression without base expression`, async () => {
      await test(dedent`
        SELECT
          CASE
            WHEN status = 1 THEN 'good'
            WHEN status = 2 THEN 'bad'
            ELSE 'unknown'
          END
      `);
    });
  });

  it(`formats quantifier expressions`, async () => {
    await testPostgresql(`SELECT x > ALL (SELECT y FROM tbl)`);
  });

  describe("BigQuery", () => {
    it(`formats BigQuery quoted table names`, async () => {
      await testBigquery("SELECT * FROM `my-project.mydataset.mytable`");
    });

    it(`formats BigQuery array field access`, async () => {
      await testBigquery(dedent`
        SELECT
          item_array,
          item_array[OFFSET(1)] AS item_offset,
          item_array[ORDINAL(1)] AS item_ordinal,
          item_array[SAFE_OFFSET(6)] AS item_safe_offset
        FROM (SELECT ["coffee", "tea", "milk"] AS item_array)
      `);
    });

    it(`formats BigQuery array field access to multiple lines`, async () => {
      await testBigquery(dedent`
        SELECT
          ["Coffee Cup", "Tea Kettle", "Milk Glass"][
            SAFE_OFFSET(some_really_long_index_number)
          ]
      `);
    });

    it(`formats BigQuery JSON field access`, async () => {
      await testBigquery(dedent`
        SELECT json_value.class.students[0]['name']
      `);
    });

    it(`formats BigQuery @@system_variables`, async () => {
      await testBigquery(`SELECT @@error.message`);
    });
  });

  describe("PostgreSQL", () => {
    it(`formats :: cast operator without spaces`, async () => {
      await testPostgresql(`SELECT 256::INTEGER`);
    });

    it(`formats row constructors`, async () => {
      await testPostgresql(`SELECT ROW(1, 2, 3)`);
    });
  });

  describe("MySQL", () => {
    it(`formats string literals with charset`, async () => {
      await testMysql(`SELECT _utf8'Hello'`);
    });

    it(`formats string concatenation with whitespace`, async () => {
      await testMysql(`SELECT 'Hello' 'world'`);
    });
  });
});
