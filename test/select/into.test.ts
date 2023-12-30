import dedent from "dedent-js";
import { testPostgresql } from "../test_utils";

describe("select into", () => {
  describe("PostgreSQL", () => {
    it(`formats INTO TABLE clause`, async () => {
      await testPostgresql(`SELECT * FROM tbl INTO my_table`);

      await testPostgresql(dedent`
        SELECT 1
        INTO TEMPORARY UNLOGGED TABLE my_table
      `);
    });
  });
});
