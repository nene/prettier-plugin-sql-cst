import dedent from "dedent-js";
import { testMysql, testPostgresql } from "../test_utils";

describe("select into", () => {
  describe("PostgreSQL", () => {
    it(`formats INTO TABLE clause`, async () => {
      await testPostgresql(`SELECT * FROM tbl INTO my_table`);

      await testPostgresql(dedent`
        SELECT 1
        INTO TEMPORARY TABLE my_table
      `);
      await testPostgresql(dedent`
        SELECT 1
        INTO UNLOGGED TABLE my_table
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

    it(`formats INTO DUMPFILE`, async () => {
      await testMysql(`SELECT 1 INTO DUMPFILE 'file_name'`);
    });

    it(`formats INTO OUTFILE`, async () => {
      await testMysql(`SELECT 1 INTO OUTFILE 'file_name'`);
    });

    it(`formats INTO OUTFILE with options`, async () => {
      await testMysql(dedent`
        SELECT 1
        INTO OUTFILE 'file_name'
          CHARACTER SET utf8
          FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' ESCAPED BY '^'
          LINES STARTING BY '!' TERMINATED BY '\\n'
      `);
    });
  });
});
