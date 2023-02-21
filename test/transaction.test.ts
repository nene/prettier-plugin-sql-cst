import dedent from "dedent-js";
import { rawTest } from "./test_utils";

describe("transaction", () => {
  it(`formats basic BEGIN..COMMIT`, () => {
    rawTest(dedent`
      BEGIN;

      SELECT 1;

      COMMIT;

    `);
  });

  it(`formats basic BEGIN..END`, () => {
    rawTest(dedent`
      BEGIN;

      SELECT 1;

      END;

    `);
  });

  it(`formats BEGIN TRANSACTION .. COMMIT TRANSACTION`, () => {
    rawTest(dedent`
      BEGIN TRANSACTION;

      SELECT 1;

      COMMIT TRANSACTION;

    `);
  });

  it(`formats BEGIN DEFERRED TRANSACTION`, () => {
    rawTest(dedent`
      BEGIN DEFERRED TRANSACTION;

    `);
  });

  it(`formats ROLLBACK`, () => {
    rawTest(dedent`
      ROLLBACK;

      ROLLBACK TRANSACTION;

      ROLLBACK TO my_savepoint;

      ROLLBACK TRANSACTION TO SAVEPOINT my_savepoint;

    `);
  });

  it(`formats SAVEPOINT`, () => {
    rawTest(dedent`
      SAVEPOINT my_savepoint;

    `);
  });

  it(`formats RELEASE SAVEPOINT`, () => {
    rawTest(dedent`
      RELEASE my_savepoint;

      RELEASE SAVEPOINT my_savepoint;

    `);
  });
});
