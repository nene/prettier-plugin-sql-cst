import dedent from "dedent-js";
import { test, testBigquery } from "../test_utils";

describe("index", () => {
  describe("create index", () => {
    it(`formats CREATE INDEX`, async () => {
      await test(dedent`
        CREATE INDEX my_index ON my_table (col1, col2)
      `);
    });

    it(`formats CREATE UNIQUE INDEX`, async () => {
      await test(dedent`
        CREATE UNIQUE INDEX my_index ON my_table (col)
      `);
    });

    it(`formats IF NOT EXISTS`, async () => {
      await test(dedent`
        CREATE INDEX IF NOT EXISTS my_index ON my_table (col)
      `);
    });

    it(`formats long columns list on multiple lines`, async () => {
      await test(dedent`
        CREATE UNIQUE INDEX IF NOT EXISTS my_index ON my_table (
          column_name_one,
          column_name_two,
          column_name_three
        )
      `);
    });

    it(`formats WHERE clause on separate line`, async () => {
      await test(dedent`
        CREATE INDEX my_index ON my_table (col)
        WHERE col > 10
      `);
    });

    it(`formats BigQuery CREATE SEARCH INDEX with OPTIONS ()`, async () => {
      await test(
        dedent`
          CREATE SEARCH INDEX my_index ON my_table (col)
          OPTIONS (analyzer = 'LOG_ANALYZER')
        `,
        { dialect: "bigquery" },
      );
    });

    it(`formats BigQuery CREATE SEARCH INDEX with ALL COLUMNS`, async () => {
      await testBigquery(dedent`
        CREATE SEARCH INDEX my_index ON my_table (ALL COLUMNS)
      `);
    });
  });

  describe("drop index", () => {
    it(`formats DROP INDEX`, async () => {
      await test(dedent`
        DROP INDEX my_index
      `);
    });

    it(`formats IF EXISTS`, async () => {
      await test(dedent`
        DROP INDEX IF EXISTS my_index
      `);
    });

    it(`formats DROP SEARCH INDEX`, async () => {
      await testBigquery(dedent`
        DROP SEARCH INDEX my_index ON my_table
      `);
    });
  });
});
