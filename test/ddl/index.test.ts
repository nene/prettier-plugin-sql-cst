import dedent from "dedent-js";
import { test, testBigquery, testPostgresql } from "../test_utils";

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

    it(`formats OR REPLACE`, async () => {
      await testBigquery(dedent`
        CREATE OR REPLACE INDEX my_index ON my_table (col)
      `);
    });

    it(`formats CONCURRENTLY`, async () => {
      await testPostgresql(dedent`
        CREATE INDEX CONCURRENTLY my_index ON my_table (col)
      `);
      await testPostgresql(dedent`
        CREATE INDEX CONCURRENTLY IF NOT EXISTS my_index ON my_table (col)
      `);
    });

    it(`formats USING clause`, async () => {
      await testPostgresql(dedent`
        CREATE INDEX my_index ON my_table USING "btree" (col)
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

    it(`formats column list with various index parameters`, async () => {
      await testPostgresql(dedent`
        CREATE INDEX my_index ON my_table (
          column_name_one COLLATE "C" ASC NULLS FIRST,
          column_name_two DESC NULLS LAST,
          (col3 + col4) my_opclass (foo = 'bar', baz = 'qux') ASC
        )
      `);
    });

    it(`formats WHERE clause on same line (if user prefers)`, async () => {
      await test(dedent`
        CREATE INDEX my_index ON my_table (col) WHERE col > 10
      `);
    });

    it(`formats WHERE clause on separate line (if user prefers)`, async () => {
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

    it(`formats CASCADE|RESTRICT`, async () => {
      await testPostgresql(dedent`
        DROP INDEX my_index CASCADE
      `);
    });

    it(`formats DROP SEARCH INDEX`, async () => {
      await testBigquery(dedent`
        DROP SEARCH INDEX my_index ON my_table
      `);
    });

    it(`formats CONCURRENTLY`, async () => {
      await testPostgresql(dedent`
        DROP INDEX CONCURRENTLY my_index
      `);
      await testPostgresql(dedent`
        DROP INDEX CONCURRENTLY IF EXISTS my_index
      `);
    });

    it(`formats multiple indexes`, async () => {
      await testPostgresql(dedent`
        DROP INDEX my_index1, my_index2
      `);
    });
  });

  describe("reindex", () => {
    it(`formats REINDEX`, async () => {
      await test(`REINDEX my_schema.my_table`);
    });

    it(`formats plain REINDEX`, async () => {
      await test(`REINDEX`);
    });
  });
});
