import dedent from "dedent-js";
import { test, testBigquery, testPostgresql } from "../test_utils";

describe("alter table", () => {
  it(`formats ALTER TABLE..RENAME`, async () => {
    await test(dedent`
      ALTER TABLE client
      RENAME TO org_client
    `);
  });

  it(`formats ALTER TABLE IF EXISTS`, async () => {
    await testBigquery(dedent`
      ALTER TABLE IF EXISTS client
      RENAME TO org_client
    `);
  });

  it(`formats ALTER TABLE..RENAME COLUMN`, async () => {
    await test(dedent`
      ALTER TABLE client
      RENAME col1 TO col2
    `);
    await test(dedent`
      ALTER TABLE client
      RENAME COLUMN col1 TO col2
    `);
  });

  it(`formats ALTER TABLE..RENAME COLUMN IF EXISTS`, async () => {
    await testBigquery(dedent`
        ALTER TABLE client
        RENAME COLUMN IF EXISTS col1 TO col2
      `);
  });

  it(`formats ALTER TABLE..ADD COLUMN`, async () => {
    await test(dedent`
      ALTER TABLE client
      ADD col1 INT
    `);
    await test(dedent`
      ALTER TABLE client
      ADD COLUMN col1 INT
    `);
  });

  it(`formats ALTER TABLE..ADD COLUMN IF NOT EXISTS`, async () => {
    await testBigquery(dedent`
      ALTER TABLE client
      ADD COLUMN IF NOT EXISTS col1 INT
    `);
  });

  it(`formats ALTER TABLE..DROP COLUMN`, async () => {
    await test(dedent`
      ALTER TABLE client
      DROP col1
    `);
    await test(dedent`
      ALTER TABLE client
      DROP COLUMN col1
    `);
  });

  it(`formats ALTER TABLE..DROP COLUMN IF EXISTS`, async () => {
    await testBigquery(dedent`
      ALTER TABLE client
      DROP COLUMN IF EXISTS col1
    `);
  });

  it(`formats ALTER TABLE..DROP COLUMN RESTRICT|CASCADE`, async () => {
    await testBigquery(dedent`
      ALTER TABLE client
      DROP COLUMN col1 RESTRICT,
      DROP COLUMN col2 CASCADE
    `);
  });

  it(`formats ALTER TABLE..SET OPTIONS`, async () => {
    await testBigquery(dedent`
      ALTER TABLE client
      SET OPTIONS (description = 'Table that expires seven days from now')
    `);
  });

  it(`formats ALTER TABLE..SET DEFAULT COLLATE`, async () => {
    await testBigquery(dedent`
      ALTER TABLE client
      SET DEFAULT COLLATE 'und:ci'
    `);
  });

  describe("alter column", () => {
    it(`formats ALTER COLUMN .. SET OPTIONS`, async () => {
      await testBigquery(dedent`
        ALTER TABLE client
        ALTER COLUMN price
        SET OPTIONS (description = 'Price per unit')
      `);
    });

    it(`formats ALTER COLUMN [IF EXISTS] .. SET DEFAULT`, async () => {
      await testBigquery(dedent`
        ALTER TABLE client
        ALTER COLUMN IF EXISTS price
        SET DEFAULT 100
      `);
    });

    it(`formats ALTER COLUMN .. DROP DEFAULT`, async () => {
      await testBigquery(dedent`
        ALTER TABLE client
        ALTER COLUMN price
        DROP DEFAULT
      `);
    });

    it(`formats ALTER COLUMN .. SET NOT NULL`, async () => {
      await testPostgresql(dedent`
        ALTER TABLE client
        ALTER COLUMN price
        SET NOT NULL
      `);
    });

    it(`formats ALTER COLUMN .. DROP NOT NULL`, async () => {
      await testBigquery(dedent`
        ALTER TABLE client
        ALTER COLUMN price
        DROP NOT NULL
      `);
    });

    it(`formats ALTER COLUMN .. SET DATA TYPE`, async () => {
      await testBigquery(dedent`
        ALTER TABLE client
        ALTER COLUMN price
        SET DATA TYPE INT64
      `);
    });
  });
});
