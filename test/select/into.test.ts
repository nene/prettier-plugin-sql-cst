import dedent from "dedent-js";
import { testMysql, testPostgresql } from "../test_utils";

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

  describe("MySQL", () => {
    it(`formats INTO @variable`, async () => {
      await testMysql(`SELECT 1, 2 INTO @var1, @var2`);
    });

    it(`formats long INTO @variable`, async () => {
      await testMysql(
        dedent`
          SELECT
            1,
            2
          INTO
            @variable1,
            @variable2
        `,
        { printWidth: 10 },
      );
    });
  });
});
