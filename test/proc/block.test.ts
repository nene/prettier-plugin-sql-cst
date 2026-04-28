import dedent from "dedent-js";
import { testBigquery, testPlpgsql } from "../test_utils";

describe("block statement", () => {
  it(`formats BEGIN .. END`, async () => {
    await testBigquery(dedent`
      BEGIN
        SELECT 1;
        SELECT 2;
        SELECT 3;
      END
    `);
  });

  it(`formats BEGIN .. EXCEPTION .. END`, async () => {
    await testBigquery(dedent`
      BEGIN
        SELECT 1;
      EXCEPTION WHEN ERROR THEN
        SELECT @@error.message;
      END
    `);
  });

  it(`formats multiple WHEN blocks inside EXCEPTION`, async () => {
    await testPlpgsql(dedent`
      BEGIN
        SELECT 1;
      EXCEPTION
        WHEN division_by_zero THEN
          SELECT 2;
        WHEN SQLSTATE '123' OR SQLSTATE '456' THEN
          SELECT 3;
          SELECT 4;
        WHEN others THEN
          SELECT 0;
      END
    `);
  });
});
