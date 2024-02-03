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
});
