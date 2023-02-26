import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("export & load", () => {
  it(`formats EXPORT DATA`, () => {
    testBigquery(dedent`
      EXPORT DATA
      OPTIONS(uri = 'gs://bucket/folder/*.csv', format = 'CSV')
      AS
        SELECT field1, field2 FROM mydataset.table1
    `);
  });

  it(`formats EXPORT DATA with CONNECTION`, () => {
    testBigquery(dedent`
      EXPORT DATA
      WITH CONNECTION myproject.us.myconnection
      OPTIONS(uri = 'gs://bucket/folder/*.csv', format = 'CSV')
      AS
        SELECT field1, field2 FROM mydataset.table1
    `);
  });
});
