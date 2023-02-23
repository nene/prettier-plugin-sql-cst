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
  });
});
