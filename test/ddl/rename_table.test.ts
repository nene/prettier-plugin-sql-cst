import dedent from "dedent-js";
import { testMysql } from "../test_utils";

describe("rename table", () => {
  it(`formats RENAME TABLE statement`, async () => {
    await testMysql(`RENAME TABLE foo TO bar`);
  });

  it(`formats multi-table rename`, async () => {
    await testMysql(`RENAME TABLE foo TO bar, zip TO zap`);
  });

  it(`formats long list of renames`, async () => {
    await testMysql(
      dedent`
        RENAME TABLE
          my_schema.some_table TO my_schema.some_other_table,
          my_schema.some_table2 TO my_schema.some_other_table2
      `,
    );
  });
});
