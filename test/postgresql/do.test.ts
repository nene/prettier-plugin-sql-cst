import dedent from "dedent-js";
import { testPostgresql } from "../test_utils";

describe("do", () => {
  it(`formats DO statement`, async () => {
    await testPostgresql(dedent`
      DO $$
        BEGIN
          PERFORM proc_name(arg1, arg2, arg3);
        END
      $$
    `);
  });

  it(`formats DO [LANGUAGE <language>]`, async () => {
    await testPostgresql(dedent`
      DO LANGUAGE plpgsql 'SELECT 1;'
    `);
  });
});
