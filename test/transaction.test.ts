import dedent from "dedent-js";
import { rawTest, testPostgresql } from "./test_utils";

describe("transaction", () => {
  it(`formats basic BEGIN..COMMIT`, async () => {
    rawTest(dedent`
      BEGIN;

      SELECT 1;

      COMMIT;

    `);
  });

  it(`formats basic BEGIN..END`, async () => {
    rawTest(dedent`
      BEGIN;

      SELECT 1;

      END;

    `);
  });

  it(`formats BEGIN TRANSACTION .. COMMIT TRANSACTION`, async () => {
    rawTest(dedent`
      BEGIN TRANSACTION;

      SELECT 1;

      COMMIT TRANSACTION;

    `);
  });

  it(`formats BEGIN TRANSACTION .. END TRANSACTION`, async () => {
    testPostgresql(dedent`
      BEGIN TRANSACTION;

      END TRANSACTION
    `);
  });

  it(`formats BEGIN WORK .. END WORK`, async () => {
    testPostgresql(dedent`
      BEGIN WORK;

      END WORK
    `);
  });

  it(`formats BEGIN DEFERRED TRANSACTION`, async () => {
    rawTest(dedent`
      BEGIN DEFERRED TRANSACTION;

    `);
  });

  it(`formats ROLLBACK`, async () => {
    rawTest(dedent`
      ROLLBACK;

      ROLLBACK TRANSACTION;

      ROLLBACK TO my_savepoint;

      ROLLBACK TRANSACTION TO SAVEPOINT my_savepoint;

    `);
  });

  it(`formats SAVEPOINT`, async () => {
    rawTest(dedent`
      SAVEPOINT my_savepoint;

    `);
  });

  it(`formats RELEASE SAVEPOINT`, async () => {
    rawTest(dedent`
      RELEASE my_savepoint;

      RELEASE SAVEPOINT my_savepoint;

    `);
  });
});
