import dedent from "dedent-js";
import { testPostgresql } from "../test_utils";

describe("sequence", () => {
  describe("create sequence", () => {
    it(`formats CREATE SEQUENCE on a single line`, async () => {
      await testPostgresql(dedent`
        CREATE SEQUENCE my_seq START WITH 10 NO CYCLE MAXVALUE 1000
      `);
    });

    it(`formats CREATE SEQUENCE on multiple lines when user prefers`, async () => {
      await testPostgresql(dedent`
        CREATE SEQUENCE my_seq
          START WITH 10
          NO CYCLE
          MAXVALUE 1000
      `);
    });

    it(`formats TEMPORARY/UNLOGGED sequence`, async () => {
      await testPostgresql(dedent`
        CREATE TEMP SEQUENCE my_seq START WITH 1
      `);
      await testPostgresql(dedent`
        CREATE UNLOGGED SEQUENCE my_seq START WITH 1
      `);
    });

    it(`formats IF NOT EXISTS`, async () => {
      await testPostgresql(dedent`
        CREATE SEQUENCE IF NOT EXISTS my_seq START WITH 1
      `);
    });

    it(`formats all possible sequence options`, async () => {
      await testPostgresql(dedent`
        CREATE SEQUENCE my_seq
          AS INTEGER
          INCREMENT BY -2
          MINVALUE -1000
          MAXVALUE 1000
          NO MINVALUE
          NO MAXVALUE
          START WITH 10
          RESTART WITH 100
          CACHE 10
          NO CYCLE
          CYCLE
          OWNED BY my_table.my_column
          OWNED BY NONE
      `);
    });
  });

  describe("alter sequence", () => {
    it(`formats ALTER SEQUENCE`, async () => {
      await testPostgresql(dedent`
        ALTER SEQUENCE my_seq
          RESTART WITH 100
      `);
    });

    it(`formats IF EXISTS`, async () => {
      await testPostgresql(dedent`
        ALTER SEQUENCE IF EXISTS my_seq
          RESTART WITH 100
      `);
    });

    it(`formats all possible sequence options`, async () => {
      await testPostgresql(dedent`
        ALTER SEQUENCE IF EXISTS my_seq
          RESTART WITH 100
          INCREMENT BY 2
          MINVALUE 0
          MAXVALUE 1000
          NO MINVALUE
          NO MAXVALUE
          START WITH 10
          RESTART WITH 100
          CACHE 10
          CYCLE
          NO CYCLE
          OWNED BY my_table.my_column
          OWNED BY NONE
      `);
    });

    [
      "SET LOGGED",
      "SET UNLOGGED",
      "OWNER TO my_user",
      "RENAME TO new_seq",
      "SET SCHEMA my_schema",
    ].forEach((action) => {
      it(`formats ${action}`, async () => {
        await testPostgresql(dedent`
          ALTER SEQUENCE IF EXISTS my_seq ${action}
        `);
        await testPostgresql(dedent`
          ALTER SEQUENCE IF EXISTS my_seq
            ${action}
        `);
      });
    });
  });

  describe("drop sequence", () => {
    it(`formats DROP SEQUENCE`, async () => {
      await testPostgresql("DROP SEQUENCE seq1, seq2");
    });

    it(`formats IF EXISTS`, async () => {
      await testPostgresql("DROP SEQUENCE IF EXISTS my_seq");
    });

    it(`formats CASCADE/RESTRICT`, async () => {
      await testPostgresql("DROP SEQUENCE my_seq CASCADE");
    });
  });
});
