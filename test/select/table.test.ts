import dedent from "dedent-js";
import { testPostgresql } from "../test_utils";

describe("TABLE statement", () => {
  it(`formats TABLE statement (syntax sugar for SELECT)`, async () => {
    await testPostgresql(`TABLE my_table`);
    await testPostgresql(dedent`
      WITH my_table AS (SELECT 1 AS col1)
      TABLE my_table
      ORDER BY col1
    `);
  });
});
