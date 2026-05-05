import dedent from "dedent-js";
import { testPostgresql } from "../test_utils";

describe("do", () => {
  it(`formats DO statement`, async () => {
    await testPostgresql(dedent`
      DO $$
      BEGIN
        SELECT 1;
      END;
      $$
    `);
  });

  it(`formats DO [LANGUAGE <language>]`, async () => {
    await testPostgresql(dedent`
      DO LANGUAGE my_lang 'SELECT 1;'
    `);
  });
});
