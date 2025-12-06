import dedent from "dedent-js";
import { pretty, testPostgresql } from "../test_utils";
import { DialectName } from "sql-parser-cst";

describe("sqlKeywordCase option", () => {
  it(`defaults to uppercasing of all keywords`, async () => {
    expect(await pretty(`select * From tbl WHERE x > 0`)).toBe(dedent`
      SELECT * FROM tbl WHERE x > 0
    `);
  });

  it(`sqlKeywordCase: "preserve" keeps keywords case as-is`, async () => {
    expect(
      await pretty(`select * From tbl WHERE x > 0`, {
        sqlKeywordCase: "preserve",
      }),
    ).toBe(dedent`
      select * From tbl WHERE x > 0
    `);
  });

  it(`sqlKeywordCase: "upper" converts keywords to uppercase`, async () => {
    expect(
      await pretty(`select * From tbl WHERE x > 0`, {
        sqlKeywordCase: "upper",
      }),
    ).toBe(dedent`
      SELECT * FROM tbl WHERE x > 0
    `);
  });

  it(`sqlKeywordCase: "lower" converts keywords to lowercase`, async () => {
    expect(
      await pretty(`select * From tbl WHERE x > 0`, {
        sqlKeywordCase: "lower",
      }),
    ).toBe(dedent`
      select * from tbl where x > 0
    `);
  });

  (["sqlite", "bigquery", "mysql", "mariadb"] as DialectName[]).forEach(
    (dialect) => {
      it(`sqlKeywordCase: "upper" converts ${dialect} data types to uppercase`, async () => {
        expect(
          await pretty(
            `CREATE TABLE foo (
              col1 int, col2 numeric (5, 3))`,
            {
              dialect,
              sqlKeywordCase: "upper",
            },
          ),
        ).toBe(dedent`
          CREATE TABLE foo (
            col1 INT,
            col2 NUMERIC(5, 3)
          )
        `);
      });
    },
  );

  it(`sqlKeywordCase: "upper" effects PostgreSQL builtin data types`, async () => {
    expect(
      await pretty(
        `CREATE TABLE foo (
        col1 int, col2 character varying (255),
        col3 my_schema.custom_type,
        col4 timestamp with time zone,
        col5 uuid
        )`,
        {
          dialect: "postgresql",
          sqlKeywordCase: "upper",
        },
      ),
    ).toBe(dedent`
      CREATE TABLE foo (
        col1 INT,
        col2 CHARACTER VARYING (255),
        col3 my_schema.custom_type,
        col4 TIMESTAMP WITH TIME ZONE,
        col5 uuid
      )
    `);
  });
});
