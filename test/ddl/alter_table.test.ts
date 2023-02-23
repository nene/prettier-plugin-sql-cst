import dedent from "dedent-js";
import { test } from "../test_utils";

describe("alter table", () => {
  it(`formats ALTER TABLE..RENAME`, () => {
    test(dedent`
      ALTER TABLE client
      RENAME TO org_client
    `);
  });

  it(`formats ALTER TABLE IF EXISTS`, () => {
    test(
      dedent`
        ALTER TABLE IF EXISTS client
        RENAME TO org_client
      `,
      { dialect: "bigquery" }
    );
  });

  it(`formats ALTER TABLE..RENAME COLUMN`, () => {
    test(dedent`
      ALTER TABLE client
      RENAME col1 TO col2
    `);
    test(dedent`
      ALTER TABLE client
      RENAME COLUMN col1 TO col2
    `);
  });

  it(`formats ALTER TABLE..RENAME COLUMN IF EXISTS`, () => {
    test(
      dedent`
        ALTER TABLE client
        RENAME COLUMN IF EXISTS col1 TO col2
      `,
      { dialect: "bigquery" }
    );
  });

  it(`formats ALTER TABLE..ADD COLUMN`, () => {
    test(dedent`
      ALTER TABLE client
      ADD col1 INT
    `);
    test(dedent`
      ALTER TABLE client
      ADD COLUMN col1 INT
    `);
  });

  it(`formats ALTER TABLE..ADD COLUMN IF NOT EXISTS`, () => {
    test(
      dedent`
      ALTER TABLE client
      ADD COLUMN IF NOT EXISTS col1 INT
    `,
      { dialect: "bigquery" }
    );
  });

  it(`formats ALTER TABLE..DROP COLUMN`, () => {
    test(dedent`
      ALTER TABLE client
      DROP col1
    `);
    test(dedent`
      ALTER TABLE client
      DROP COLUMN col1
    `);
  });

  it(`formats ALTER TABLE..DROP COLUMN IF EXISTS`, () => {
    test(
      dedent`
        ALTER TABLE client
        DROP COLUMN IF EXISTS col1
      `,
      { dialect: "bigquery" }
    );
  });

  it(`formats ALTER TABLE..SET OPTIONS`, () => {
    test(
      dedent`
        ALTER TABLE client
        SET OPTIONS(description = 'Table that expires seven days from now')
      `,
      { dialect: "bigquery" }
    );
  });

  it(`formats ALTER TABLE..SET DEFAULT COLLATE`, () => {
    test(
      dedent`
        ALTER TABLE client
        SET DEFAULT COLLATE 'und:ci'
      `,
      { dialect: "bigquery" }
    );
  });

  describe("alter column", () => {
    it(`formats ALTER COLUMN .. SET OPTIONS`, () => {
      test(
        dedent`
          ALTER TABLE client
          ALTER COLUMN price
          SET OPTIONS(description = 'Price per unit')
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats ALTER COLUMN [IF EXISTS] .. SET DEFAULT`, () => {
      test(
        dedent`
          ALTER TABLE client
          ALTER COLUMN IF EXISTS price
          SET DEFAULT 100
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats ALTER COLUMN .. DROP DEFAULT`, () => {
      test(
        dedent`
          ALTER TABLE client
          ALTER COLUMN price
          DROP DEFAULT
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats ALTER COLUMN .. DROP NOT NULL`, () => {
      test(
        dedent`
          ALTER TABLE client
          ALTER COLUMN price
          DROP NOT NULL
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats ALTER COLUMN .. SET DATA TYPE`, () => {
      test(
        dedent`
          ALTER TABLE client
          ALTER COLUMN price
          SET DATA TYPE INT64
        `,
        { dialect: "bigquery" }
      );
    });
  });
});
