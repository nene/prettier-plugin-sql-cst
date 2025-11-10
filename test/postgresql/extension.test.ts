import dedent from "dedent-js";
import { testPostgresql } from "../test_utils";

describe("extensions", () => {
  it(`formats CREATE EXTENSION`, async () => {
    await testPostgresql(dedent`
      CREATE EXTENSION my_extension
    `);
  });

  it(`formats long CREATE EXTENSION on single line`, async () => {
    await testPostgresql(dedent`
      CREATE EXTENSION IF NOT EXISTS my_extension SCHEMA my_schema
    `);
  });

  it(`formats long CREATE EXTENSION`, async () => {
    await testPostgresql(dedent`
      CREATE EXTENSION IF NOT EXISTS my_extension
        WITH SCHEMA my_schema VERSION '1.0' CASCADE
    `);
  });

  it(`formats DROP EXTENSION`, async () => {
    await testPostgresql(dedent`
      DROP EXTENSION IF EXISTS ext1, ext2 CASCADE
    `);
  });
});
