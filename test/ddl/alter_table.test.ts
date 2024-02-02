import dedent from "dedent-js";
import { test, testBigquery, testMysql, testPostgresql } from "../test_utils";

describe("alter table", () => {
  it(`formats short ALTER TABLE..RENAME on a single line`, async () => {
    await test(dedent`
      ALTER TABLE client RENAME TO org_client
    `);
  });

  it(`preserves ALTER TABLE..RENAME on muliple lines`, async () => {
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

  it(`formats ALTER TABLE..SET SCHEMA`, async () => {
    await testPostgresql(dedent`
      ALTER TABLE client
      SET SCHEMA new_schema
    `);
  });

  describe("alter column", () => {
    it(`formats short ALTER COLUMN on a single line (if user prefers)`, async () => {
      await testBigquery(dedent`
        ALTER TABLE client ALTER COLUMN price DROP DEFAULT
      `);
    });

    it(`formats only the ALTER COLUMN-part on single line (if user prefers)`, async () => {
      await testBigquery(dedent`
        ALTER TABLE client
        ALTER COLUMN price DROP DEFAULT
      `);
    });

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

    it(`formats ALTER COLUMN .. SET VISIBLE/INVISIBLE`, async () => {
      await testMysql(dedent`
        ALTER TABLE client
        ALTER COLUMN price
        SET VISIBLE
      `);
      await testMysql(dedent`
        ALTER TABLE client
        ALTER COLUMN price
        SET INVISIBLE
      `);
    });
  });

  describe("constraints", () => {
    it(`formats ADD CONSTRAINT`, async () => {
      await testPostgresql(dedent`
        ALTER TABLE client
        ADD CONSTRAINT price_positive CHECK (price > 0) NOT VALID
      `);
      await testPostgresql(dedent`
        ALTER TABLE client
        ADD PRIMARY KEY (price)
      `);
    });

    it(`formats DROP CONSTRAINT`, async () => {
      await testPostgresql(dedent`
        ALTER TABLE client
        DROP CONSTRAINT price_positive
      `);
      await testPostgresql(dedent`
        ALTER TABLE client
        DROP CONSTRAINT IF EXISTS price_positive CASCADE
      `);
    });

    it(`formats ALTER CONSTRAINT`, async () => {
      await testPostgresql(dedent`
        ALTER TABLE client
        ALTER CONSTRAINT price_positive DEFERRABLE INITIALLY DEFERRED
      `);
      await testMysql(dedent`
        ALTER TABLE client
        ALTER CHECK price_positive NOT ENFORCED
      `);
    });

    it(`formats RENAME CONSTRAINT`, async () => {
      await testPostgresql(dedent`
        ALTER TABLE client
        RENAME CONSTRAINT price_positive1 TO price_positive2
      `);
    });

    it(`formats VALIDATE CONSTRAINT`, async () => {
      await testPostgresql(dedent`
        ALTER TABLE client
        VALIDATE CONSTRAINT price_positive
      `);
    });
  });

  it("formats ALTER TABLE ALL IN TABLESPACE", async () => {
    await testPostgresql(dedent`
      ALTER TABLE ALL IN TABLESPACE my_tablespace
      SET TABLESPACE new_tablespace
    `);
  });

  it("formats ALTER TABLE ALL IN TABLESPACE..OWNED BY", async () => {
    await testPostgresql(dedent`
      ALTER TABLE ALL IN TABLESPACE my_ts OWNED BY user1, user2
      SET TABLESPACE new_ts
    `);
    await testPostgresql(dedent`
      ALTER TABLE ALL IN TABLESPACE my_tablespace OWNED BY
        john_doe_the_second,
        CURRENT_USER
      SET TABLESPACE new_tablespace NOWAIT
    `);
  });
});
