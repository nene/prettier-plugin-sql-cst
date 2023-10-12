import dedent from "dedent-js";
import { test, testBigquery } from "../test_utils";

describe("alter table", () => {
  it(`formats ALTER TABLE..RENAME`, async () => {
    test(dedent`
      ALTER TABLE client
      RENAME TO org_client
    `);
  });

  it(`formats ALTER TABLE IF EXISTS`, async () => {
    testBigquery(dedent`
      ALTER TABLE IF EXISTS client
      RENAME TO org_client
    `);
  });

  it(`formats ALTER TABLE..RENAME COLUMN`, async () => {
    test(dedent`
      ALTER TABLE client
      RENAME col1 TO col2
    `);
    test(dedent`
      ALTER TABLE client
      RENAME COLUMN col1 TO col2
    `);
  });

  it(`formats ALTER TABLE..RENAME COLUMN IF EXISTS`, async () => {
    testBigquery(dedent`
        ALTER TABLE client
        RENAME COLUMN IF EXISTS col1 TO col2
      `);
  });

  it(`formats ALTER TABLE..ADD COLUMN`, async () => {
    test(dedent`
      ALTER TABLE client
      ADD col1 INT
    `);
    test(dedent`
      ALTER TABLE client
      ADD COLUMN col1 INT
    `);
  });

  it(`formats ALTER TABLE..ADD COLUMN IF NOT EXISTS`, async () => {
    testBigquery(dedent`
      ALTER TABLE client
      ADD COLUMN IF NOT EXISTS col1 INT
    `);
  });

  it(`formats ALTER TABLE..DROP COLUMN`, async () => {
    test(dedent`
      ALTER TABLE client
      DROP col1
    `);
    test(dedent`
      ALTER TABLE client
      DROP COLUMN col1
    `);
  });

  it(`formats ALTER TABLE..DROP COLUMN IF EXISTS`, async () => {
    testBigquery(dedent`
      ALTER TABLE client
      DROP COLUMN IF EXISTS col1
    `);
  });

  it(`formats ALTER TABLE..SET OPTIONS`, async () => {
    testBigquery(dedent`
      ALTER TABLE client
      SET OPTIONS (description = 'Table that expires seven days from now')
    `);
  });

  it(`formats ALTER TABLE..SET DEFAULT COLLATE`, async () => {
    testBigquery(dedent`
      ALTER TABLE client
      SET DEFAULT COLLATE 'und:ci'
    `);
  });

  describe("alter column", () => {
    it(`formats ALTER COLUMN .. SET OPTIONS`, async () => {
      testBigquery(dedent`
        ALTER TABLE client
        ALTER COLUMN price
        SET OPTIONS (description = 'Price per unit')
      `);
    });

    it(`formats ALTER COLUMN [IF EXISTS] .. SET DEFAULT`, async () => {
      testBigquery(dedent`
        ALTER TABLE client
        ALTER COLUMN IF EXISTS price
        SET DEFAULT 100
      `);
    });

    it(`formats ALTER COLUMN .. DROP DEFAULT`, async () => {
      testBigquery(dedent`
        ALTER TABLE client
        ALTER COLUMN price
        DROP DEFAULT
      `);
    });

    it(`formats ALTER COLUMN .. DROP NOT NULL`, async () => {
      testBigquery(dedent`
        ALTER TABLE client
        ALTER COLUMN price
        DROP NOT NULL
      `);
    });

    it(`formats ALTER COLUMN .. SET DATA TYPE`, async () => {
      testBigquery(dedent`
        ALTER TABLE client
        ALTER COLUMN price
        SET DATA TYPE INT64
      `);
    });
  });
});
