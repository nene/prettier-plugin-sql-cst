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

  it(`formats ALTER TABLE..ADD COLUMN with constraints`, async () => {
    await testPostgresql(dedent`
      ALTER TABLE client
      ADD COLUMN col1 INT COLLATE "en_US" NOT NULL
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

  it(`formats ALTER TABLE with ENABLE/DISABLE actions`, async () => {
    await testPostgresql(dedent`
      ALTER TABLE client
      DISABLE TRIGGER ALL,
      ENABLE TRIGGER my_trigger,
      ENABLE REPLICA TRIGGER trigger2,
      ENABLE ALWAYS TRIGGER trigger3,
      ENABLE REPLICA RULE my_rule,
      DISABLE RULE r2,
      DISABLE ROW LEVEL SECURITY,
      ENABLE ROW LEVEL SECURITY
    `);
  });

  it(`formats ALTER TABLE with [NO] FORCE actions`, async () => {
    await testPostgresql(dedent`
      ALTER TABLE client
      FORCE ROW LEVEL SECURITY,
      NO FORCE ROW LEVEL SECURITY
    `);
  });

  it(`formats ALTER TABLE with clustering actions`, async () => {
    await testPostgresql(dedent`
      ALTER TABLE client
      CLUSTER ON index_name,
      SET WITHOUT CLUSTER
    `);
  });

  it(`formats ALTER TABLE with logging actions`, async () => {
    await testPostgresql(dedent`
      ALTER TABLE client
      SET LOGGED,
      SET UNLOGGED
    `);
  });

  it(`formats ALTER TABLE with inheritance actions`, async () => {
    await testPostgresql(dedent`
      ALTER TABLE client
      INHERIT parent_table,
      NO INHERIT grandparent_table
    `);
  });

  it(`formats ALTER TABLE with OF type actions`, async () => {
    await testPostgresql(dedent`
      ALTER TABLE client
      OF new_type,
      NOT OF
    `);
  });

  it(`formats ALTER TABLE with SET/RESET (storage parameters)`, async () => {
    await testPostgresql(dedent`
      ALTER TABLE client
      SET (fillfactor = 70, autovacuum_enabled),
      RESET (toast.autovacuum_enabled, max_rows)
    `);
  });

  it(`formats ALTER TABLE with SET/RESET (long storage parameters list)`, async () => {
    await testPostgresql(dedent`
      ALTER TABLE client
      SET (
        fillfactor = 70,
        autovacuum_enabled,
        toast.autovacuum_enabled,
        max_rows = 100,
        visibility_map
      ),
      RESET (
        toast.autovacuum_enabled,
        max_rows,
        autovacuum_enabled,
        fillfactor,
        parallel_workers
      )
    `);
  });

  it(`formats ALTER TABLE with PostgreSQL alter-actions`, async () => {
    await testPostgresql(dedent`
      ALTER TABLE client
      SET SCHEMA new_schema,
      SET TABLESPACE new_tablespace NOWAIT,
      SET WITHOUT OIDS,
      SET ACCESS METHOD heap,
      OWNER TO new_owner,
      OWNER TO CURRENT_USER,
      REPLICA IDENTITY DEFAULT,
      REPLICA IDENTITY USING INDEX index_name
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

    it(`formats ALTER COLUMN [IF EXISTS]`, async () => {
      await testBigquery(dedent`
        ALTER TABLE client
        ALTER COLUMN IF EXISTS price
        DROP DEFAULT
      `);
    });

    [
      "SET DEFAULT 100",
      "DROP DEFAULT",
      "SET NOT NULL",
      "DROP NOT NULL",
      "SET STATISTICS 100",
      "SET STORAGE PLAIN",
      "SET COMPRESSION ZLIB",
      "SET (fillfactor = 70)",
      "RESET (autovacuum_enabled)",
      "DROP EXPRESSION IF EXISTS",
      "DROP IDENTITY IF EXISTS",
      "ADD GENERATED ALWAYS AS IDENTITY",
      "ADD GENERATED BY DEFAULT AS IDENTITY",
    ].forEach((action) => {
      it(`formats ALTER COLUMN .. ${action}`, async () => {
        await testPostgresql(dedent`
          ALTER TABLE client
          ALTER COLUMN price
          ${action}
        `);
      });
    });

    ["SET VISIBLE", "SET INVISIBLE"].forEach((action) => {
      it(`formats ALTER COLUMN .. ${action}`, async () => {
        await testMysql(dedent`
          ALTER TABLE client
          ALTER COLUMN price
          ${action}
        `);
      });
    });

    it(`formats ALTER COLUMN .. SET OPTIONS`, async () => {
      await testBigquery(dedent`
        ALTER TABLE client
        ALTER COLUMN price
        SET OPTIONS (description = 'Price per unit')
      `);
    });

    it(`formats ALTER COLUMN .. SET DATA TYPE`, async () => {
      await testBigquery(dedent`
        ALTER TABLE client
        ALTER COLUMN price
        SET DATA TYPE INT64
      `);
      await testPostgresql(dedent`
        ALTER TABLE client
        ALTER COLUMN price
        TYPE INT COLLATE "en_US" USING price > 0
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
      await testPostgresql(dedent`
        ALTER TABLE client
        ADD UNIQUE USING INDEX price_unique
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
