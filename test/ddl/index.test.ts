import dedent from "dedent-js";
import { test } from "../test_utils";

describe("index", () => {
  describe("create index", () => {
    it(`formats CREATE INDEX`, () => {
      test(dedent`
        CREATE INDEX my_index ON my_table (col1, col2)
      `);
    });

    it(`formats CREATE UNIQUE INDEX`, () => {
      test(dedent`
        CREATE UNIQUE INDEX my_index ON my_table (col)
      `);
    });

    it(`formats IF NOT EXISTS`, () => {
      test(dedent`
        CREATE INDEX IF NOT EXISTS my_index ON my_table (col)
      `);
    });

    it(`formats long columns list on multiple lines`, () => {
      test(dedent`
        CREATE UNIQUE INDEX IF NOT EXISTS my_index ON my_table (
          column_name_one,
          column_name_two,
          column_name_three
        )
      `);
    });

    it(`formats WHERE clause on separate line`, () => {
      test(dedent`
        CREATE INDEX my_index ON my_table (col)
        WHERE col > 10
      `);
    });

    it(`formats BigQuery CREATE SEARCH INDEX with OPTIONS()`, () => {
      test(
        dedent`
          CREATE SEARCH INDEX my_index ON my_table (col)
          OPTIONS(analyzer = 'LOG_ANALYZER')
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats BigQuery CREATE SEARCH INDEX with ALL COLUMNS`, () => {
      test(
        dedent`
          CREATE SEARCH INDEX my_index ON my_table (ALL COLUMNS)
        `,
        { dialect: "bigquery" }
      );
    });
  });

  describe("drop index", () => {
    it(`formats DROP INDEX`, () => {
      test(dedent`
        DROP INDEX my_index
      `);
    });

    it(`formats IF EXISTS`, () => {
      test(dedent`
        DROP INDEX IF EXISTS my_index
      `);
    });

    it(`formats DROP SEARCH INDEX`, () => {
      test(
        dedent`
          DROP SEARCH INDEX my_index ON my_table
        `,
        { dialect: "bigquery" }
      );
    });
  });
});
