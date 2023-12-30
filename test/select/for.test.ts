import dedent from "dedent-js";
import { testPostgresql } from "../test_utils";

describe("select for", () => {
  it(`formats basic FOR clause`, async () => {
    await testPostgresql(`SELECT 1 FOR UPDATE`);
    await testPostgresql(`SELECT 1 FOR NO KEY UPDATE`);
  });

  it(`formats FOR clause with tables and modifiers`, async () => {
    await testPostgresql(
      dedent`
        SELECT 1
        FOR SHARE OF table1, table2 SKIP LOCKED
      `,
    );
  });

  it(`formats FOR clause with long list of tables`, async () => {
    await testPostgresql(
      dedent`
        SELECT 1
        FOR SHARE OF
          very_long_table_name1,
          very_long_table_name2,
          very_long_table_name3
          NOWAIT
      `,
    );
  });
});
