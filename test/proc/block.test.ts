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

  it(`formats EXCEPTION block`, async () => {
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

  it(`formats empty DECLARE block`, async () => {
    await testPlpgsql(dedent`
      DECLARE
      BEGIN
        SELECT 1;
      END
    `);
  });

  it(`formats DECLARE block with variables`, async () => {
    await testPlpgsql(dedent`
      DECLARE
        foo INT;
        bar TEXT;
      BEGIN
        SELECT 1;
      END
    `);
  });

  it(`formats DECLARE block with initialized variables`, async () => {
    await testPlpgsql(dedent`
      DECLARE
        foo INT = 10;
        bar TEXT := 'Hello';
        baz NUMERIC DEFAULT 12.3;
      BEGIN
        SELECT 1;
      END
    `);
  });
});
